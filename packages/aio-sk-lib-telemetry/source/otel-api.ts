// This file re-exports the most commonly used OpenTelemetry components.
// It provides core APIs, SDKs, exporters, and resources while omitting
// specialized packages like individual instrumentations and similar utilities.

import { OTLPTraceExporter as OTLPTraceExporterProto } from '@opentelemetry/exporter-trace-otlp-proto';
import { OTLPMetricExporter as OTLPMetricExporterProto } from '@opentelemetry/exporter-metrics-otlp-proto';
import { OTLPLogExporter as OTLPLogExporterProto } from '@opentelemetry/exporter-logs-otlp-proto';
export { OTLPTraceExporterProto, OTLPMetricExporterProto, OTLPLogExporterProto };

import { OTLPTraceExporter as OTLPTraceExporterHttp } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter as OTLPMetricExporterHttp } from '@opentelemetry/exporter-metrics-otlp-http';
import { OTLPLogExporter as OTLPLogExporterHttp } from '@opentelemetry/exporter-logs-otlp-http';
export { OTLPTraceExporterHttp, OTLPMetricExporterHttp, OTLPLogExporterHttp };

import { OTLPTraceExporter as OTLPTraceExporterGrpc } from '@opentelemetry/exporter-trace-otlp-grpc';
import { OTLPMetricExporter as OTLPMetricExporterGrpc } from '@opentelemetry/exporter-metrics-otlp-grpc';
import { OTLPLogExporter as OTLPLogExporterGrpc } from '@opentelemetry/exporter-logs-otlp-grpc';
export { OTLPTraceExporterGrpc, OTLPMetricExporterGrpc, OTLPLogExporterGrpc };

export * from '@opentelemetry/api';
export * from '@opentelemetry/api-logs';
export * from '@opentelemetry/resources';
export * from '@opentelemetry/semantic-conventions';