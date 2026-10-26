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

## WordPress als Redaktion und Datenbank

Die Hauptwebsite bleibt eine statische React/Vite-Seite. WordPress läuft separat als CMS unter `https://cms.hannes-sandbox.com`; es speichert Beiträge und Seiten in MariaDB/MySQL. Die öffentliche Website liest veröffentlichte Inhalte über die WordPress REST API unter `/wp-json/wp/v2/`. Die Anmeldung und Bearbeitung erfolgen im WordPress-Backend. Es werden keine WordPress-Zugangsdaten in React oder im Browser gespeichert.

### Hosting-Voraussetzungen

Die Befehle unten sind für einen Debian-/Ubuntu-Server mit Caddy gedacht. Sie sind eine Anleitung zur manuellen Einrichtung; sie wurden nicht auf dem Server ausgeführt. Passe Domain, PHP-FPM-Socket und Zugangsdaten an deine Installation an. Lege für `cms.hannes-sandbox.com` einen DNS-A-Record zur Server-IP an. Bestehende Caddy-Site-Blöcke bleiben erhalten.

Installiere PHP-FPM, die WordPress-PHP-Erweiterungen und MariaDB:

```bash
sudo apt update
sudo apt install mariadb-server php-fpm php-mysql php-curl php-gd php-intl php-mbstring php-xml php-zip curl tar
ls /run/php/
```

`ls /run/php/` zeigt den vorhandenen PHP-FPM-Socket. Im Caddy-Beispiel unten ist `php8.2-fpm.sock` ein Platzhalter; ersetze ihn durch den Socket, der auf deinem Server tatsächlich existiert.

### MariaDB-Datenbank anlegen

Erzeuge zuerst ein langes Passwort und bewahre es in einem Passwortmanager auf. Öffne dann die lokale MariaDB-Konsole:

```bash
openssl rand -base64 32
sudo mariadb
```

Führe in der MariaDB-Konsole die folgenden SQL-Befehle aus. Ersetze `HIER_EIN_EIGENES_LANGES_PASSWORT_EINSETZEN` durch das zuvor erzeugte Passwort:

```sql
CREATE DATABASE hannes_wordpress CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'hannes_wp'@'localhost' IDENTIFIED BY 'HIER_EIN_EIGENES_LANGES_PASSWORT_EINSETZEN';
GRANT ALL PRIVILEGES ON hannes_wordpress.* TO 'hannes_wp'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

Der Datenbankbenutzer erhält nur Rechte auf die WordPress-Datenbank. WordPress verwaltet seine Beiträge, Seiten, Kategorien und Einstellungen dort selbst.

### WordPress installieren

Lade WordPress herunter, installiere es in einem eigenen Verzeichnis und übergib die Dateiverwaltung an PHP-FPM:

```bash
cd /tmp
curl -LO https://wordpress.org/latest.tar.gz
tar -xzf latest.tar.gz
sudo mkdir -p /srv/www/wordpress
sudo cp -a /tmp/wordpress/. /srv/www/wordpress/
sudo chown -R www-data:www-data /srv/www/wordpress
sudo -u www-data cp /srv/www/wordpress/wp-config-sample.php /srv/www/wordpress/wp-config.php
sudo nano /srv/www/wordpress/wp-config.php
```

Trage in `wp-config.php` für `DB_NAME`, `DB_USER`, `DB_PASSWORD` und `DB_HOST` `hannes_wordpress`, `hannes_wp`, das erzeugte Passwort und `localhost` ein. Ersetze außerdem die WordPress-Salts mit eigenen Werten, die du mit dem offiziellen WordPress-Salt-Service erzeugst. Speichere die Datei.

Nach dem WordPress-Installationsassistenten kannst du die Datenbank-Konfiguration auf Root und die PHP-Gruppe beschränken:

```bash
sudo chown root:www-data /srv/www/wordpress/wp-config.php
sudo chmod 640 /srv/www/wordpress/wp-config.php
```

Ergänze `/etc/caddy/Caddyfile` um einen eigenen CMS-Site-Block. Lass den bestehenden Block für die statische Hauptwebsite bestehen:

```caddyfile
hannes-sandbox.com {
    root * /srv/projects/websites/homepage
    file_server
}

cms.hannes-sandbox.com {
    root * /srv/www/wordpress
    php_fastcgi unix//run/php/php8.2-fpm.sock
    file_server
}
```

Ersetze im CMS-Block den PHP-Socket wie oben beschrieben. Wenn `hannes-sandbox.com` bereits in deiner Caddy-Datei konfiguriert ist, bearbeite diesen bestehenden Block, statt einen doppelten Block hinzuzufügen. Prüfe und lade Caddy neu:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

Öffne `https://cms.hannes-sandbox.com` im Browser und beende den WordPress-Installationsassistenten. Lege dabei dein eigenes Administratorkonto an. Dieses Administratorkonto bleibt privat und wird nicht an den Redakteur weitergegeben.

### Eingeschränkte Redakteursrolle installieren

Im Repository liegt das kleine WordPress-Plugin [`wordpress-plugin/site-content-editor.php`](wordpress-plugin/site-content-editor.php). Es registriert die Rolle **Website Content Editor**. Sie darf eigene Blogbeiträge und eigene Seiten erstellen, veröffentlichen und bearbeiten sowie Bilder hochladen. Sie erhält keine Rechte für Themes, Plugins, Benutzerverwaltung, Website-Einstellungen, fremde Inhalte oder Code-Dateien.

Kopiere das Plugin vom lokalen Repository aus auf den Server. Ersetze `SERVER_HOST` gegebenenfalls durch die Server-IP oder den SSH-Host:

```powershell
scp .\wordpress-plugin\site-content-editor.php hannes@SERVER_HOST:/tmp/site-content-editor.php
```

Installiere es anschließend auf dem Server:

```bash
sudo install -D -o root -g root -m 644 /tmp/site-content-editor.php /srv/www/wordpress/wp-content/plugins/site-content-editor/site-content-editor.php
```

Melde dich als WordPress-Administrator unter `https://cms.hannes-sandbox.com/wp-admin` an, öffne **Plugins** und aktiviere **Site Content Editor Role**. Das Plugin ergänzt die eingeschränkte Rolle bei der Aktivierung.

### Redakteur-Login anlegen

Als Administrator in WordPress:

1. Öffne **Benutzer → Neu hinzufügen**.
2. Vergib einen eigenen Benutzernamen und die E-Mail-Adresse des Redakteurs.
3. Verwende ein starkes, einzigartiges Passwort. Sende das Passwort nicht zusammen mit dem Benutzernamen im selben ungeschützten Kanal; sicherer ist, WordPress die Benachrichtigung senden und den Benutzer selbst ein Passwort setzen zu lassen.
4. Wähle als Rolle **Website Content Editor** und lege den Benutzer an.
5. Teile ausschließlich den Login `https://cms.hannes-sandbox.com/wp-admin` mit. Vergib weder einen Server-SSH-Zugang noch GitHub-Zugriff oder die WordPress-Administratorrolle.

Der Benutzer kann im Backend unter **Beiträge** Blogbeiträge schreiben und veröffentlichen und unter **Seiten** eigene Inhaltsseiten erstellen. Die Rolle darf keine bestehenden Seiten anderer Benutzer bearbeiten. Ein WordPress-Administrator kann Benutzer und Inhalte weiterhin verwalten.

### React-Website mit WordPress verbinden

Die Vite-App liest veröffentlichte Beiträge und Seiten öffentlich aus der REST API; Besucher brauchen dafür keinen Login. Die API-Basis ist `https://cms.hannes-sandbox.com/wp-json`. Erstelle für die lokale Entwicklung `main-site/.env.local` mit:

```dotenv
VITE_WORDPRESS_API_URL=https://cms.hannes-sandbox.com/wp-json
```

Für GitHub Actions lege unter **Settings → Secrets and variables → Actions → Variables** eine Repository-Variable `VITE_WORDPRESS_API_URL` mit demselben API-Basiswert an. Der Build-Schritt übergibt diese Variable an Vite. Sie ist keine geheime Zugangsinformation.

Starte lokal Vite neu, nachdem du `.env.local` angelegt hast. Beim nächsten Build und Deployment bezieht die Website Blogbeiträge, Tags und WordPress-Seiten aus dem CMS. Beiträge erscheinen in der Blogliste, auf der Homepage und unter `#/blog/<slug>`. Eigene WordPress-Seiten erscheinen automatisch als Links im Bereich „Seiten“ auf der Homepage und unter `#/pages/<slug>`; beispielsweise führt eine WordPress-Seite mit dem Slug `game1` zu `https://hannes-sandbox.com/#/pages/game1`.

Die WordPress-Seite ist damit als Content-Quelle in die Website eingebunden, nicht als iframe. Das Schreiben geschieht im WordPress-Backend; die öffentliche Website zeigt nur veröffentlichte Inhalte. Nicht veröffentlichte Entwürfe werden nicht über die öffentliche API angezeigt. Die aktuelle App lädt pro Inhaltstyp höchstens 100 Einträge in einem Abruf.

**Subdomain-Hinweis:** Eine WordPress-Seite mit dem Slug `game1` erzeugt eine Unterseite auf der Hauptdomain (`#/pages/game1`), aber nicht automatisch `game1.hannes-sandbox.com`. Eine eigene Subdomain benötigt zusätzlich einen DNS-Eintrag und eine passende Caddy-Konfiguration. Diese Änderungen kann die eingeschränkte Redakteursrolle bewusst nicht selbst vornehmen.

Die bisherigen MDX-Beispiele in `main-site/src/content/posts/` sind lokale Beispieldateien und werden nach dem Verbinden nicht mehr als Blogquelle verwendet. Übertrage Inhalte, die du behalten möchtest, einmalig in WordPress.

## Mehrere Apps mit eigenen Repositories und Deploy-Zugängen

Für jede unabhängige App – zum Beispiel `game1.hannes-sandbox.com` – verwende ein eigenes GitHub-Repository, ein eigenes Serververzeichnis und einen eigenen SSH-Deploybenutzer. So kann die App unabhängig gebaut und veröffentlicht werden. Der Deploybenutzer bekommt kein `sudo` und kann nur in sein App-Verzeichnis schreiben. Teile weder den Linux-Account `hannes` noch dessen SSH-Schlüssel.

Beispielzuordnung:

| App          | GitHub-Repository                 | Domain                     | Serververzeichnis                 | Deploybenutzer                  |
| ------------ | --------------------------------- | -------------------------- | --------------------------------- | ------------------------------- |
| Hauptwebsite | bestehendes Repository            | `hannes-sandbox.com`       | `/srv/projects/websites/homepage` | `hannes` (bestehender Workflow) |
| Game 1       | eigenes Repository, z. B. `game1` | `game1.hannes-sandbox.com` | `/srv/projects/websites/game1`    | `game1-deploy`                  |
| Nächste App  | eigenes Repository, z. B. `game2` | `game2.hannes-sandbox.com` | `/srv/projects/websites/game2`    | `game2-deploy`                  |

### 1. Neues Repository für die App anlegen

Erstelle für jede App ein eigenes GitHub-Repository. Eine Vite-App sollte im Repository-Root eine `package.json` und `package-lock.json` haben. Typische Skripte sind `dev`, `lint` und `build`. Für Three.js installierst du die Abhängigkeit im App-Repository und importierst sie im Vite-Projekt:

```powershell
npm install three
```

Three.js wird mit dem Frontend gebaut und läuft anschließend im Browser. Python-Code kann nicht als Teil dieses statischen Builds ausgeführt werden; er braucht einen separaten Serverdienst (siehe weiter unten).

### 2. DNS und Caddy für die Subdomain einrichten

Lege beim DNS-Anbieter einen `A`-Record `game1` an, der auf die öffentliche IPv4-Adresse des Servers zeigt. Lege nur dann einen `AAAA`-Record an, wenn der Server unter der angegebenen IPv6-Adresse erreichbar ist. Caddy benötigt korrekte DNS-Einträge und externe Erreichbarkeit über TCP-Port 80 und 443, um für die Domain automatisch HTTPS-Zertifikate auszustellen und zu erneuern.[^caddy-https]

Erstelle das Zielverzeichnis und füge der `/etc/caddy/Caddyfile` einen eigenen Host-Block hinzu:

```caddyfile
game1.hannes-sandbox.com {
    root * /srv/projects/websites/game1
    file_server
}
```

Lass die bestehenden Host-Blöcke stehen. Prüfe und lade die Konfiguration neu:

```bash
sudo caddy validate --config /etc/caddy/Caddyfile
sudo systemctl reload caddy
```

### 3. Eingeschränkten Deploybenutzer anlegen

Prüfe zunächst, unter welcher Gruppe Caddy läuft. Auf der üblichen Paketinstallation ist es `caddy`:

```bash
systemctl show caddy -p User -p Group
getent group caddy
```

Lege den Benutzer ohne `sudo`-Rechte an. Er benötigt eine Shell für den SSH/SCP-Deployschritt, erhält aber nur Schreibrechte auf sein eigenes Zielverzeichnis:

```bash
sudo useradd --system --create-home --home-dir /home/game1-deploy --shell /bin/sh --gid caddy game1-deploy
sudo install -d -o game1-deploy -g caddy -m 2750 /srv/projects/websites/game1
sudo install -d -o game1-deploy -g caddy -m 700 /home/game1-deploy/.ssh
sudo nano /home/game1-deploy/.ssh/authorized_keys
sudo chown game1-deploy:caddy /home/game1-deploy/.ssh/authorized_keys
sudo chmod 600 /home/game1-deploy/.ssh/authorized_keys
```

Falls die Caddy-Gruppe auf deinem Server anders heißt, verwende diese Gruppe statt `caddy`. Füge in `authorized_keys` nur den öffentlichen Schlüssel für diese App ein. Der Deploybenutzer kann damit in sein Verzeichnis schreiben, aber keine Dateien unter `/srv/projects/websites/homepage` oder anderen App-Zielen ändern. Er erhält keine `sudo`-Rechte. Wie bei jedem normalen Linux-Konto können allgemein lesbare Systemdateien weiterhin lesbar sein.

### 4. Eigenen SSH-Schlüssel für dieses Repository erstellen

Auf deinem Entwicklungsrechner erzeugst du ein neues Schlüsselpaar. Erstelle für jede App ein eigenes Paar; verwende nicht den Schlüssel deines Hannes-Kontos oder denselben privaten Schlüssel für alle Repositories:

```powershell
ssh-keygen -t ed25519 -C "github-actions-game1" -f "$env:USERPROFILE\.ssh\game1_deploy"
```

Füge den Inhalt von `game1_deploy.pub` in die oben angelegte `authorized_keys` ein. Hinterlege danach den **privaten** Schlüssel `game1_deploy` in den Actions-Secrets des `game1`-Repositories. Der private Schlüssel bleibt aus dem Repository heraus.

Wenn du dem Schlüssel eine Passphrase gibst, hinterlege sie als Secret `SSH_KEY_PASSPHRASE`. Die SSH-Host-Fingerprint des Servers kannst du mit folgendem Befehl anzeigen lassen und verifiziert als Secret `SERVER_HOST_FINGERPRINT` speichern:

```bash
sudo ssh-keygen -lf /etc/ssh/ssh_host_ed25519_key.pub
```

Unter **Repository → Settings → Secrets and variables → Actions → Secrets** legst du diese Secrets an:

| Secret                    | Wert                                           |
| ------------------------- | ---------------------------------------------- |
| `SERVER_HOST`             | Server-IP oder Hostname                        |
| `SERVER_USER`             | `game1-deploy`                                 |
| `SSH_PRIVATE_KEY`         | Inhalt der privaten Datei `game1_deploy`       |
| `SSH_KEY_PASSPHRASE`      | Passphrase des privaten Schlüssels (optional)  |
| `SERVER_HOST_FINGERPRINT` | Verifizierter SSH-Host-Fingerprint (empfohlen) |

### 5. GitHub Actions im App-Repository einrichten

Lege im App-Repository `.github/workflows/deploy.yml` an. Das Beispiel setzt voraus, dass sich `package.json` und `package-lock.json` im Repository-Root befinden und `npm run build` nach `dist/` baut:

```yaml
name: Build and Deploy Game 1

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: 22
          cache: npm

      - name: Install dependencies
        run: npm ci

      - name: Lint
        run: npm run lint

      - name: Build
        run: npm run build

      - name: Deploy static build
        uses: appleboy/scp-action@v1
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          passphrase: ${{ secrets.SSH_KEY_PASSPHRASE }}
          fingerprint: ${{ secrets.SERVER_HOST_FINGERPRINT }}
          port: 22
          source: "dist/*"
          target: "/srv/projects/websites/game1"
          strip_components: 1
```

Der Workflow startet automatisch bei Push auf `main` oder manuell über **Actions → Build and Deploy Game 1 → Run workflow**. Er baut nur dieses Repository und kopiert den `dist`-Inhalt in das Game-1-Verzeichnis. Lege für jede weitere App ein eigenes Repository, einen eigenen SSH-Schlüssel, Deploybenutzer, Ordner, Caddy-Host-Block und Workflow an; ändere in der Kopie Namen, Host und Zielpfad.

Der SCP-Schritt entfernt keine alten Dateien, die nicht mehr im neuen Build vorkommen. Wenn du später gelöschte Dateien sicher aus dem Ziel entfernen möchtest, ergänze einen kontrollierten `rsync --delete`-Deployschritt, nachdem du dessen Zielpfad geprüft hast.

### Python-Backend einer App

Wenn `game1` Python benötigt, bleibt das Frontend weiterhin eine statische Vite-App. Das Python-Backend läuft als separater systemd-Dienst, idealerweise unter einem eigenen Systemkonto wie `game1-api` ohne interaktive Anmeldung und ohne `sudo`. Caddy kann eine separate API-Subdomain an einen nur lokal erreichbaren Port weiterleiten:

```caddyfile
api-game1.hannes-sandbox.com {
    reverse_proxy 127.0.0.1:8001
}
```

Der Dienst bindet dann nur an `127.0.0.1:8001`; Caddy nimmt öffentliche Verbindungen entgegen und leitet sie intern weiter. Python-Code sollte nicht als `hannes`, als Caddy-Benutzer oder als WordPress-Redakteur ausgeführt werden. Das Backend benötigt eine eigene Dependency- und Deployment-Konfiguration sowie eine gezielte CORS-Regel für `https://game1.hannes-sandbox.com`. Der oben gezeigte Frontend-Workflow installiert und startet keinen Python-Dienst.

[^caddy-https]: [Caddy: Automatic HTTPS](https://caddyserver.com/docs/automatic-https)
