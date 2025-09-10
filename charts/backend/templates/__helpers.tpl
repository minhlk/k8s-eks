{{- define "db.secretChecksum" -}}
{{ include (print $.Template.BasePath "/../db/templates/secret.yml") . | sha256sum }}
{{- end -}}
