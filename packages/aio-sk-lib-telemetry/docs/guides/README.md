# Instrument App Builder Apps with OpenTelemetry

This documentation provides guides for setting up observability for your App Builder apps, using various tools and approaches.

- [Instrument App Builder Apps with OpenTelemetry](#instrument-app-builder-apps-with-opentelemetry)
  - [Available Guides](#available-guides)
  - [Supporting Guides](#supporting-guides)


## Available Guides

> [!TIP]
> Feel free to explore multiple guides and combine their approaches to create a solution that best fits your observability needs, backend preferences, and use case requirements.

<table>
  <thead>
    <tr>
        <th>Guide</th>
        <th>Via</th>
        <th>Protocol</th>
        <th>Signals</th>
        <th>Local Development</th>
        <th>App Builder</th>
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


