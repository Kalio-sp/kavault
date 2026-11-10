#!/bin/bash
set -e

echo "=========================================================="
echo "          Развёртывание KAVAULT на сервере Yandex Cloud    "
echo "=========================================================="

# 1. Проверка swap (на машинах с 2 ГБ RAM создаем swap на 2 ГБ, чтобы сборка Docker не вылетала)
SWAP_TOTAL=$(free -m | awk '/^Swap:/ {print $2}')
if [ "$SWAP_TOTAL" -eq 0 ]; then
    echo "Создаем swapfile 2 ГБ для стабильной сборки и работы..."
    sudo fallocate -l 2G /swapfile || sudo dd if=/dev/zero of=/swapfile bs=1M count=2048
    sudo chmod 600 /swapfile
    sudo mkswap /swapfile
    sudo swapon /swapfile
    echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
    echo "Swap успешно подключен."
fi

# 2. Проверка и установка Docker
if ! command -v docker &> /dev/null; then
    echo "Docker не найден. Устанавливаем официальный Docker..."
    while sudo fuser /var/lib/dpkg/lock-frontend >/dev/null 2>&1 || sudo fuser /var/lib/apt/lists/lock >/dev/null 2>&1; do
        echo "Ожидание завершения фонового apt-get..."
        sleep 3
    done
    curl -fsSL https://get.docker.com -o get-docker.sh
    sudo sh get-docker.sh || sudo DEBIAN_FRONTEND=noninteractive apt-get install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin docker-buildx-plugin
    rm -f get-docker.sh
    sudo systemctl enable --now docker || true
    sudo usermod -aG docker $USER || true
    echo "Docker установлен."
fi

# 3. Разрешаем трафик в локальном firewall UFW (если он активен)
if command -v ufw &> /dev/null; then
    if sudo ufw status | grep -q "Status: active"; then
        echo "Настройка UFW: открываем порты 80, 4000, 22..."
        sudo ufw allow 22/tcp
        sudo ufw allow 80/tcp
        sudo ufw allow 4000/tcp
    fi
fi

# 4. Сборка и запуск контейнеров в фоне
echo "Собираем образы и запускаем KAVAULT..."
DOCKER_CMD="docker compose"
if ! docker info &> /dev/null; then
    DOCKER_CMD="sudo docker compose"
fi

$DOCKER_CMD -f docker-compose.production.yml up -d --build

echo ""
echo "=========================================================="
echo "   Успешно! KAVAULT запущен 24/7 на сервере Yandex Cloud! "
echo "   - Веб-версия (iPhone/ПК):  http://51.250.64.21"
echo "   - Бэкенд API:              http://51.250.64.21:4000"
echo "=========================================================="
$DOCKER_CMD -f docker-compose.production.yml ps
