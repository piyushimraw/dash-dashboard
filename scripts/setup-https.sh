#!/bin/bash

# Setup HTTPS certificates for local development using mkcert
# This enables PWA install prompt testing on localhost

set -e

CERT_DIR="apps/shell/certs"
CERT_NAME="localhost+2"

echo "=== HTTPS Certificate Setup for Local Development ==="
echo ""

# Check if mkcert is installed
if ! command -v mkcert &> /dev/null; then
    echo "mkcert is not installed."
    echo ""
    echo "Install mkcert using Homebrew:"
    echo "  brew install mkcert"
    echo ""
    echo "Or see: https://github.com/FiloSottile/mkcert#installation"
    exit 1
fi

echo "✓ mkcert is installed"

# Check if local CA is installed
if ! mkcert -CAROOT &> /dev/null || [ ! -f "$(mkcert -CAROOT)/rootCA.pem" ]; then
    echo ""
    echo "Installing local Certificate Authority..."
    echo "This requires your password to add the CA to your system trust store."
    echo ""
    mkcert -install
    echo ""
    echo "✓ Local CA installed"
else
    echo "✓ Local CA already installed"
fi

# Create certs directory
mkdir -p "$CERT_DIR"

# Check if certificates already exist
if [ -f "$CERT_DIR/$CERT_NAME.pem" ] && [ -f "$CERT_DIR/$CERT_NAME-key.pem" ]; then
    echo "✓ Certificates already exist in $CERT_DIR"
    echo ""
    read -p "Regenerate certificates? (y/N) " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "Setup complete! Run: pnpm run build && pnpm run preview"
        exit 0
    fi
fi

# Generate certificates
echo ""
echo "Generating certificates for localhost..."
cd "$CERT_DIR"
mkcert localhost 127.0.0.1 ::1
cd - > /dev/null

echo ""
echo "✓ Certificates created in $CERT_DIR"
echo ""
echo "=== Setup Complete ==="
echo ""
echo "Next steps:"
echo "  1. Restart your browser (quit and reopen)"
echo "  2. Run: pnpm run build && pnpm run preview"
echo "  3. Open: https://localhost:4173"
echo ""
echo "The PWA install banner should appear automatically."
