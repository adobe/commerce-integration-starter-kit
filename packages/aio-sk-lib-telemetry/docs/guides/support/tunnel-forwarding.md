# Forwarding Telemetry Signals to Local Observability Backends

> [!CAUTION]
> **Development Only**: This approach is intended solely for development and testing purposes. Never use tunneling services to expose production telemetry data or local services in production environments due to security and reliability concerns.

This guide demonstrates how you can set up tunneling services to forward telemetry signals from deployed App Builder runtime actions to fully-local observability tools. This approach enables you to develop and test with local backends while your actions run in production environments.

## Prerequisites

- Docker (for running local observability backends and tunnel tools)
- A local observability backend (e.g., Grafana, Jaeger, Prometheus, OpenTelemetry Collector)
- An App Builder project using OpenTelemetry

## Why Use Tunneling?

When developing App Builder applications, you often want to send telemetry data to local observability tools for easier debugging and development. However, deployed runtime actions cannot directly access localhost services. Tunneling tools solve this by creating public URLs that proxy requests to your local services.

### The Local Collector Advantage

Rather than exposing multiple local services individually, the recommended approach is to run a **single OpenTelemetry Collector locally** and expose only that collector through the tunnel. The collector can then:

- Receive all telemetry signals through one endpoint
- Export to multiple local backends simultaneously 
- Provide a single point of configuration
- Reduce tunnel complexity and costs
- Enable easy switching between different local tool combinations

## Tunneling Tools Comparison

### ngrok

| **Pros**                                 | **Cons**                                    |
|------------------------------------------|---------------------------------------------|
| Reliable and stable connections          | Free tier has session time limits (2 hours) |
| Rich dashboard and analytics             | Requires account registration               |
| **Supports both HTTP and TCP tunneling** | URLs change on free tier restarts           |
| Authentication and security features     | Can be expensive for heavy usage            |

**Manual Installation:**
```bash
# Via Homebrew (macOS)
brew install ngrok

# Or download from https://ngrok.com/
```

**Docker Usage:**
```bash
# Run ngrok in Docker (HTTP)
docker run --rm -it --net=host ngrok/ngrok:latest http 4318

# Run ngrok with TCP for gRPC support
docker run --rm -it --net=host ngrok/ngrok:latest tcp 4317

# Or with custom domain (paid accounts)
docker run --rm -it --net=host ngrok/ngrok:latest http --domain=your-custom-domain.ngrok.io 4318
```

### Cloudflare Tunnel (cloudflared)

| **Pros**                                       | **Cons**                               |
|------------------------------------------------|----------------------------------------|
| Completely free                                | **HTTP only - no gRPC/TCP support**    |
| No time limits                                 | Less mature than ngrok                 |
| Excellent performance via Cloudflare's network | Account required for permanent tunnels |
| High security and DDoS protection              | No built-in request inspection tools   |

**Manual Installation:**
```bash
# Via Homebrew (macOS)
brew install cloudflared

# Or download from https://developers.cloudflare.com/cloudflare-one/connections/connect-apps/install-and-setup/
```

**Docker Usage:**
```bash
# Quick temporary tunnel (HTTP only)
docker run --rm -it --net=host cloudflare/cloudflared:latest tunnel --url http://localhost:4318

# For persistent tunnels, mount config directory
docker run --rm -it --net=host -v ~/.cloudflared:/etc/cloudflared cloudflare/cloudflared:latest tunnel run my-tunnel
```

### LocalTunnel

| **Pros**                                       | **Cons**                                   |
|------------------------------------------------|--------------------------------------------|
| No account registration required               | **HTTP only - no gRPC/TCP support**        |
| Completely free                                | Less reliable than commercial alternatives |
| Simple command-line interface                  | Limited performance and uptime guarantees  |
| Open source                                    | URLs may be less stable                    |

**Manual Installation:**
```bash
npm install -g localtunnel
```

**Docker Usage:**
```bash
# Run LocalTunnel in Docker (HTTP only)
docker run --rm -it --net=host efrecon/localtunnel --port 4318

# With custom subdomain
docker run --rm -it --net=host efrecon/localtunnel --port 4318 --subdomain my-otel-collector
```

## Configuration

Once you have your tunnel running and exposing your local OpenTelemetry Collector, you can configure your telemetry exporters to use the tunnel URL.

### HTTP Configuration (Most Common)

For HTTP tunneling (works with all tunnel tools), configure your exporters with path suffixes:

- **Traces**: Use `https://your-tunnel-url.com/v1/traces`
- **Metrics**: Use `https://your-tunnel-url.com/v1/metrics`  
- **Logs**: Use `https://your-tunnel-url.com/v1/logs`

The tunnel URL can be hardcoded directly in your configuration since it's not sensitive information. However, if you prefer to use environment variables for easier management across different environments, you can set `OTEL_COLLECTOR_TUNNEL_URL` in your `.env` file and reference it in your `app.config.yaml`:

```yaml
# app.config.yaml (optional approach)
my-action:
  function: path/to/my-action.js
  inputs:
    OTEL_COLLECTOR_TUNNEL_URL: $OTEL_COLLECTOR_TUNNEL_URL
```

### gRPC Configuration (ngrok TCP only)

> [!NOTE]
> For most development scenarios, HTTP tunneling is sufficient and simpler to set up. Consider gRPC only if you're experiencing performance issues or need to test gRPC-specific functionality.

OpenTelemetry supports both HTTP and gRPC protocols for OTLP (OpenTelemetry Protocol). While HTTP works with all tunneling tools, **gRPC requires TCP tunneling support**, which is only available with ngrok. For gRPC tunneling use just the base endpoint without path suffixes:

#### Setting Up gRPC Tunneling with ngrok

```bash
# Tunnel the gRPC port (4317)
ngrok tcp 4317
```

Then configure your telemetry to use the gRPC exporter with the TCP tunnel URL:

```ts
// Replace with your ngrok TCP URL
const grpcEndpoint = "tcp://0.tcp.ngrok.io:12345";

// Use gRPC exporters instead of HTTP
import {
  OTLPTraceExporterGrpc,
  OTLPMetricExporterGrpc,
  OTLPLogExporterGrpc
} from "@adobe/aio-lib-telemetry/otel-api";

// For tunneling, you may need insecure credentials
import { credentials } from "@grpc/grpc-js";

// Configure with gRPC endpoint - NO path suffixes needed!
traceExporter: new OTLPTraceExporterGrpc({
  url: grpcEndpoint,
  credentials: credentials.createInsecure()
})
```

> [!IMPORTANT]
> **gRPC vs HTTP path differences:**
> - **HTTP**: Requires path suffixes like `/v1/traces`, `/v1/metrics`, `/v1/logs`
> - **gRPC**: Uses only the base endpoint - service definitions are built into the protocol
>
> Do **NOT** add `/v1/traces` etc. to gRPC endpoints!
>
> **About insecure credentials:** When tunneling gRPC traffic, you may need to use `credentials.createInsecure()` since tunnel connections don't typically provide proper TLS certificates. This is acceptable for development/testing scenarios.

#### When to Use gRPC vs HTTP

| **Aspect**           | **HTTP**                                   | **gRPC**                            |
|----------------------|--------------------------------------------|-------------------------------------|
| **Tunnel Support**   | All tools (ngrok, Cloudflare, LocalTunnel) | ngrok TCP only                      |
| **Setup Complexity** | Simple                                     | More complex                        |
| **Performance**      | Good                                       | Better (lower latency, compression) |
| **Debugging**        | Easy to inspect/debug                      | Harder to debug                     |
| **Configuration**    | Requires path suffixes (`/v1/traces`)      | Base endpoint only                  |
| **Firewall/Proxy**   | Better compatibility                       | May have issues                     |
| **Use Cases**        | Most development scenarios                 | High-performance requirements       |

## Important Considerations

### Security
- **Never use in production**: Tunneling exposes local services to the internet
- Use authentication headers when the tunnel service supports it
- Rotate tunnel URLs regularly for temporary development setups
- Be mindful of what data you're sending through public tunnels

### Performance
- Tunneling adds network latency to your telemetry exports
- Monitor tunnel bandwidth limits with free tier services
- Consider using gRPC instead of HTTP for better performance when supported
- Adjust OpenTelemetry batch sizes if you experience timeout issues

This approach is ideal for development and testing scenarios where you need the flexibility of local observability tools while working with deployed App Builder actions. 