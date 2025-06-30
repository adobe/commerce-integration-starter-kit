# Instrument App Builder Apps with OpenTelemetry

This documentation provides guides for setting up observability for your App Builder apps, using various tools and approaches.

> [!NOTE]
> The guides presented here are **example use cases** demonstrating different ways to integrate observability into your App Builder applications. They are not intended as authoritative or one-size-fits-all solutions. Instead, they showcase various possible approaches you can adapt, modify, or combine to fit your specific requirements, infrastructure, and observability goals.

- [Instrument App Builder Apps with OpenTelemetry](#instrument-app-builder-apps-with-opentelemetry)
  - [Use Cases](#use-cases)
  - [Supporting Guides](#supporting-guides)

## Use Cases

Below is a summary table of the documented use cases. Key terms:

- `Local Development`: Runtime actions executed locally using `aio app dev`

- `In Cloud`: Runtime actions deployed to the cloud via `aio app deploy`
  - A `Via Tunneling` indicator shows that the guide demonstrates forwarding telemetry from deployed actions to a local observability stack. This is just one possible approach, you're not required to use tunneling (especially not in production). For instance, with hosted solutions like Grafana, you can configure direct data transmission instead.

<table>
  <thead>
    <tr>
      <th>Guide</th>
      <th>Via</th>
      <th>Protocol</th>
      <th>Signals</th>
      <th>Local Development</th>
      <th>In Cloud</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>
        <a href="./grafana.md">
          <strong>Grafana (Tempo, Loki, Prometheus)</strong>
        </a>
      </td>
      <td align="center">OpenTelemetry Collector</td>
      <td align="center">HTTP/Protobuf</td>
      <td align="center">Traces, Metrics, Logs</td>
      <td align="center">Covered ✅</td>
      <td align="center">Via Tunneling ⚠️</td>
    </tr>
    <tr>
        <td>
            <a href="./new-relic.md">
                <strong>New Relic</strong>
            </a>
        </td>
        <td align="center">Direct Export</td>
        <td align="center">HTTP/Protobuf</td>
        <td align="center">Traces, Metrics, Logs</td>
        <td align="center">Covered ✅</td>
        <td align="center">Covered ✅</td>
    </tr>
  </tbody>
</table>

## Supporting Guides

These guides provide additional technical details and setup instructions that complement the main observability guides above.

<table>
  <thead>
    <tr>
        <th>Guide</th>
        <th>Purpose</th>
        <th>Use Case</th>
    </tr>
  </thead>
  <tbody>
    <tr>
        <td>
            <a href="./support/tunnel-forwarding.md">
                <strong>Tunneling for Local Observability</strong>
            </a>
        </td>
        <td>Forward telemetry from deployed actions to local tools</td>
        <td>Development/Testing ⚠️</td>
    </tr>
  </tbody>
</table>


