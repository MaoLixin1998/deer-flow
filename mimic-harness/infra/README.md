# Infra

这里放本地开发和可观测性基础设施：

```text
docker/
nginx/
observability/
  otel-collector.yaml
  prometheus/
  grafana/
```

第一阶段先只需要 Docker Compose：

```text
frontend
java-agent
python-agent
postgres
redis
```

