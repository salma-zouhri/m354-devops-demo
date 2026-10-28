# Image de production : sert le build React (dossier dist/) avec nginx.
# Le pipeline construit dist/ UNE fois, puis l'emballe ici : le même artefact part
# sur GitHub Pages et dans cette image (build once, deploy many).
#   Local : npm run build && docker build -t m354-web . && docker run -p 8080:8080 m354-web
FROM nginxinc/nginx-unprivileged:1.31-alpine

LABEL org.opencontainers.image.title="m354-devops-demo" \
      org.opencontainers.image.description="Planning des exposés M354, démo DevOps"

COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY dist/ /usr/share/nginx/html/

# Image non-root (utilisateur nginx), port non privilégié
EXPOSE 8080
HEALTHCHECK --interval=15s --timeout=3s --retries=3 \
  CMD wget -qO- http://127.0.0.1:8080/version.json >/dev/null || exit 1
