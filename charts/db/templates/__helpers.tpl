{{- define "db.secretChecksum" -}}
{{ include (print $.Template.BasePath "/secret.yml") . | sha256sum }}
{{- end -}}
