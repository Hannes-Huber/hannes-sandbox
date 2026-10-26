# Persönliche Website

Dieses Repository enthält die persönliche Website mit Blog und Creative-Code-Projekten sowie eine kleine statische App für eine Subdomain.

## Aufbau

- `main-site/` – React-Website mit Vite; Blogbeiträge liegen einzeln als MDX-Dateien vor.
- `subdomain-app-test/` – statische App, derzeit mit `index.html` als Einstiegspunkt.
- `.github/workflows/deploy.yml` – GitHub-Actions-Workflow für Build und Deployment beider Ziele.

## Voraussetzungen

Für die lokale Entwicklung der Hauptwebsite brauchst du Node.js 22 und npm. Der Server benötigt keinen Node.js- oder Vite-Prozess: GitHub Actions erzeugt statische Dateien und überträgt sie per SSH/SCP.

## Lokal starten

```powershell
cd main-site
npm ci
npm run dev
```

Vite zeigt nach dem Start die lokale Entwicklungsadresse an (standardmäßig `http://localhost:5173`). Die Anwendung nutzt Hash-Routing, zum Beispiel `#/blog` und `#/creative-code`.

### Prüfen und bauen

Im Ordner `main-site/`:

```powershell
npm run lint
npm run build
npm run preview
```

`npm run build` schreibt die veröffentlichbaren Dateien nach `main-site/dist/`. `npm run preview` zeigt den zuletzt gebauten Stand lokal an.

## Blogbeiträge bearbeiten

Jeder Beitrag ist eine eigene Datei unter `main-site/src/content/posts/` mit der Endung `.mdx`. Die Datei exportiert am Anfang Metadaten als `meta`; der restliche Dateiinhalt ist der Beitragstext. Beispiel:

```mdx
export const meta = {
  slug: "mein-neuer-beitrag",
  title: "Mein neuer Beitrag",
  date: "2026-10-24",
  readingTime: "4 min",
  excerpt: "Eine kurze Beschreibung für die Beitragsliste.",
  tags: ["Notizen", "Web"],
};

Der Beitragstext wird hier in **MDX** geschrieben. Markdown-Formatierung ist möglich, ebenso JSX-Komponenten.
```

Der `slug` bildet die Blog-URL `#/blog/mein-neuer-beitrag`. Das Datum sollte im Format `YYYY-MM-DD` stehen. Die Beiträge werden anhand ihres Datums sortiert; Listen und Detailseiten werden aus den MDX-Dateien generiert. Bilder und andere lokale Assets sollten im Projekt abgelegt und mit passenden relativen Pfaden eingebunden werden.

## GitHub Actions: Build und Deployment

Der Workflow liegt in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) und heißt **Build and Deploy Static Website**.

### Auslöser

- Push auf den Branch `main` startet den Workflow automatisch.
- Über **Actions → Build and Deploy Static Website → Run workflow** kann er manuell gestartet werden. Dabei lässt sich der Branch auswählen.

### Ablauf für `main-site`

1. Repository auschecken.
2. Node.js 22 einrichten und npm-Cache anhand von `main-site/package-lock.json` verwenden.
3. In `main-site/` die Abhängigkeiten mit `npm ci` installieren.
4. `npm run lint` ausführen. Bei Fehlern stoppt der Workflow vor dem Build und Deployment.
5. Mit `npm run build` die statische Website nach `main-site/dist/` bauen.
6. `main-site/dist/` als Actions-Artefakt `main-site-dist` speichern.
7. Im separaten Deploy-Job das Artefakt laden und seinen Inhalt per SCP nach `/srv/projects/websites/homepage` kopieren.

### Ablauf für `subdomain-app-test`

Im selben Deploy-Job wird `subdomain-app-test/*` unverändert per SCP nach `/srv/projects/websites/testproject` kopiert. Für diese App gibt es im Workflow derzeit keinen eigenen Installations-, Lint- oder Build-Schritt.

### Repository-Secrets

Unter **Settings → Secrets and variables → Actions** müssen folgende Repository-Secrets gesetzt sein:

| Secret            | Inhalt                                      |
| ----------------- | ------------------------------------------- |
| `SERVER_HOST`     | Hostname oder IP-Adresse des Servers        |
| `SERVER_USER`     | SSH-Benutzer für die Deployments            |
| `SSH_PRIVATE_KEY` | Privater SSH-Schlüssel des Deploy-Benutzers |

Der Server muss SSH-Verbindungen auf Port 22 akzeptieren. Der zugehörige öffentliche Schlüssel muss für `SERVER_USER` autorisiert sein. Der Benutzer benötigt Schreibrechte in `/srv/projects/websites/homepage` und `/srv/projects/websites/testproject`; die Verzeichnisse müssen auf dem Server vorhanden sein oder vom SCP-Schritt angelegt werden können.

### Webserver

Der Webserver muss die Dateien aus `/srv/projects/websites/homepage` als Hauptwebsite ausliefern und für die zweite App auf `/srv/projects/websites/testproject` zeigen. Da die Hauptwebsite Hash-Routing verwendet, braucht sie für ihre `#/...`-Routen keine zusätzliche SPA-Fallback-Regel.

Der SCP-Schritt kopiert Dateien, löscht aber keine Dateien, die auf dem Server liegen und nicht mehr im Build enthalten sind. Veraltete Dateien können daher im Zielverzeichnis verbleiben.

## Deployment kontrollieren

Den Lauf findest du im GitHub-Repository unter **Actions → Build and Deploy Static Website**. Der Build-Job muss erfolgreich sein, bevor der Deploy-Job startet. Bei fehlgeschlagenem Deployment zuerst die Secrets, den SSH-Zugang sowie Pfad- und Schreibrechte auf dem Server prüfen.

## Einmalige Servereinrichtung

Die folgenden Schritte sind für die initiale Einrichtung des Linux-Servers gedacht. Führe sie mit einem Konto aus, das `sudo` verwenden darf. Die Deployments kopieren den gebauten Inhalt direkt nach `/srv/projects/websites/homepage`; Caddy muss daher dieses Verzeichnis als Website-Root ausliefern. Ein Shell-Prompt wie `/srv/projects/websites/homepage/src#` ist kein Befehl und `src` ist nicht das Deployment-Ziel.

### 1. Website-Verzeichnis vorbereiten

Lege die Verzeichnisse an und gib dem Deploy-Benutzer `hannes` Schreibrechte:

```bash
sudo mkdir -p /srv/projects/websites/homepage
sudo mkdir -p /srv/projects/websites/testproject
sudo chown -R hannes:hannes /srv/projects
```

### 2. Caddy konfigurieren

Öffne die Caddy-Konfiguration:

```bash
sudo nano /etc/caddy/Caddyfile
```

Richte für die Hauptwebsite einen Site-Block ein, dessen `root` auf `/srv/projects/websites/homepage` zeigt und der statische Dateien ausliefert. Verwende dort den tatsächlichen Domainnamen. Konfiguriere die Subdomain-App bei Bedarf entsprechend mit `/srv/projects/websites/testproject`.

Prüfe die Konfiguration und lade Caddy anschließend neu:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### 3. SSH-Schlüssel für `hannes` einrichten

Füge den öffentlichen Schlüssel, der zu `SSH_PRIVATE_KEY` in GitHub passt, in die `authorized_keys` des Deploy-Benutzers ein. Der folgende Ablauf geht davon aus, dass der Schlüssel bereits in `/root/.ssh/authorized_keys` liegt und nach `/home/hannes/.ssh/authorized_keys` kopiert werden soll:

```bash
sudo mkdir -p /home/hannes/.ssh
sudo cp /root/.ssh/authorized_keys /home/hannes/.ssh/authorized_keys
sudo chown -R hannes:hannes /home/hannes/.ssh
sudo chmod 700 /home/hannes/.ssh
sudo chmod 600 /home/hannes/.ssh/authorized_keys
```

**Achtung:** `cp` ersetzt eine bereits vorhandene `authorized_keys`-Datei. Wenn dort schon andere Schlüssel eingetragen sind, füge den Deploy-Schlüssel stattdessen hinzu, ohne die vorhandene Datei zu überschreiben. Der private Schlüssel gehört ausschließlich in das GitHub-Secret `SSH_PRIVATE_KEY`; auf den Server kommt der passende öffentliche Schlüssel.

### 4. SSH-Server prüfen und neu starten

Bearbeite die SSH-Serverkonfiguration nur, wenn Anpassungen erforderlich sind:

```bash
sudo nano /etc/ssh/sshd_config
sudo sshd -t
```

`sshd -t` muss ohne Fehlermeldung enden. Starte SSH erst danach neu:

```bash
sudo systemctl restart ssh
```

Lass eine bestehende SSH-Sitzung geöffnet und prüfe eine neue Anmeldung als `hannes`, bevor du die bestehende Sitzung schließt. So bleibt ein Rückweg offen, falls die neue SSH-Konfiguration den Zugang verhindert.

### 5. Deployment testen

Prüfe, dass `hannes` in beide Deployment-Ziele schreiben kann. Trage anschließend `SERVER_HOST`, `SERVER_USER` (`hannes`) und `SSH_PRIVATE_KEY` als GitHub-Actions-Secrets ein und starte den Workflow manuell. Bei Erfolg sollte Caddy die Dateien aus `/srv/projects/websites/homepage` ausliefern.
