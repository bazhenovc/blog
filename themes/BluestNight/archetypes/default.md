+++
title = "{{ replace .TranslationBaseName "-" " " | title }}"
date = "{{ .Date }}"{{ with $.Site.Params.author }}
author = "{{ . }}"{{ end }}
hide_authorbox = true
disable_comments = true
draft = true
+++
