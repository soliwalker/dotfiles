#!/bin/bash
# Complete Development Environment Setup
# Fedora + i3 + Modern Web Dev Stack
# Run with: curl -sSL https://raw.githubusercontent.com/yourusername/dotfiles/main/install.sh | bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==>${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}!${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Check if running on Fedora
if [ ! -f /etc/fedora-release ]; then
    print_error "This script is designed for Fedora. Please adapt for your distro."
    exit 1
fi

print_step "Starting development environment setup..."

# Update system
print_step "Updating system packages..."
sudo dnf update -y

# Install base packages
print_step "Installing base packages..."
sudo dnf install -y \
    i3 i3lock i3status dmenu \
    alacritty \
    zsh \
    git \
    curl \
    wget \
    vim \
    neovim \
    tmux \
    ranger \
    fzf \
    ripgrep \
    fd-find \
    bat \
    exa \
    htop \
    tree \
    unzip \
    nodejs \
    npm \
    docker \
    docker-compose \
    code \
    firefox \
    flameshot \
    redshift \
    feh \
    polybar \
    rofi \
    dunst

# Enable Docker
print_step "Configuring Docker..."
sudo systemctl enable docker
sudo systemctl start docker
sudo usermod -aG docker $USER

# Install pnpm (faster npm alternative)
print_step "Installing pnpm..."
curl -fsSL https://get.pnpm.io/install.sh | sh

# Install fnm (Fast Node Manager)
print_step "Installing fnm (Node version manager)..."
curl -fsSL https://fnm.vercel.app/install | bash

# Setup fnm and install latest Node
export PATH="$HOME/.local/share/fnm:$PATH"
eval "$(fnm env)"
fnm install --lts
fnm use lts-latest

# Install Cursor (AI-powered VSCode alternative)
print_step "Installing Cursor..."
curl -fsSL https://download.cursor.sh/linux/appImage/x64 -o cursor.appimage
chmod +x cursor.appimage
sudo mv cursor.appimage /usr/local/bin/cursor

# Create directory structure
print_step "Creating directory structure..."
mkdir -p ~/Code/{learning,projects,playground}
mkdir -p ~/Code/learning/{nextjs,astro,directus}
mkdir -p ~/.config/{i3,alacritty,polybar,rofi,dunst}
mkdir -p ~/.local/bin

# Clone dotfiles (replace with your repo)
print_step "Setting up dotfiles..."
DOTFILES_DIR="$HOME/.dotfiles"
if [ ! -d "$DOTFILES_DIR" ]; then
    git clone https://github.com/soliwalker/dotfiles.git "$DOTFILES_DIR"
fi

# Link configuration files
ln -sf "$DOTFILES_DIR/i3/config" ~/.config/i3/config
ln -sf "$DOTFILES_DIR/alacritty/alacritty.yml" ~/.config/alacritty/alacritty.yml
ln -sf "$DOTFILES_DIR/zsh/.zshrc" ~/.zshrc
ln -sf "$DOTFILES_DIR/tmux/.tmux.conf" ~/.tmux.conf
ln -sf "$DOTFILES_DIR/git/.gitconfig" ~/.gitconfig

# Install Oh My Zsh
print_step "Installing Oh My Zsh..."
if [ ! -d "$HOME/.oh-my-zsh" ]; then
    sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)" "" --unattended
fi

# Install useful zsh plugins
git clone https://github.com/zsh-users/zsh-syntax-highlighting.git ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-syntax-highlighting
git clone https://github.com/zsh-users/zsh-autosuggestions ${ZSH_CUSTOM:-~/.oh-my-zsh/custom}/plugins/zsh-autosuggestions

# Change default shell to zsh
chsh -s $(which zsh)

# Install global npm packages for development
print_step "Installing global development tools..."
pnpm add -g \
    @astrojs/cli \
    create-next-app \
    @directus/cli \
    vercel \
    netlify-cli \
    @types/node \
    typescript \
    eslint \
    prettier \
    nodemon \
    pm2

# Setup VSCode extensions for AI coding
print_step "Installing VSCode extensions..."
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension GitHub.copilot
code --install-extension ms-python.python
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension ms-vscode.vscode-json
code --install-extension astro-build.astro-vscode

# Create useful development scripts
print_step "Creating development scripts..."

cat > ~/.local/bin/new-next << 'EOF'
#!/bin/bash
# Quick Next.js project creator
PROJECT_NAME=$1
if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: new-next <project-name>"
    exit 1
fi
cd ~/Code/projects
pnpm create next-app@latest $PROJECT_NAME --typescript --tailwind --app --import-alias "@/*"
cd $PROJECT_NAME
cursor .
EOF

cat > ~/.local/bin/new-astro << 'EOF'
#!/bin/bash
# Quick Astro project creator
PROJECT_NAME=$1
if [ -z "$PROJECT_NAME" ]; then
    echo "Usage: new-astro <project-name>"
    exit 1
fi
cd ~/Code/projects
pnpm create astro@latest $PROJECT_NAME
cd $PROJECT_NAME
cursor .
EOF

cat > ~/.local/bin/dev-env << 'EOF'
#!/bin/bash
# Launch development environment
# Usage: dev-env <project-path>
PROJECT_PATH=${1:-$(pwd)}

if [ ! -d "$PROJECT_PATH" ]; then
    echo "Project directory does not exist: $PROJECT_PATH"
    exit 1
fi

cd "$PROJECT_PATH"

# Create new tmux session for the project
SESSION_NAME=$(basename "$PROJECT_PATH")
tmux new-session -d -s "$SESSION_NAME" -c "$PROJECT_PATH"

# Window 1: Editor
tmux rename-window -t "$SESSION_NAME:0" "editor"
tmux send-keys -t "$SESSION_NAME:editor" "cursor ." Enter

# Window 2: Dev server
tmux new-window -t "$SESSION_NAME" -n "dev"
tmux send-keys -t "$SESSION_NAME:dev" "pnpm dev" Enter

# Window 3: Terminal
tmux new-window -t "$SESSION_NAME" -n "terminal"

# Attach to session
tmux attach-session -t "$SESSION_NAME"
EOF

chmod +x ~/.local/bin/*

# Create learning resources
print_step "Creating learning resources..."
cat > ~/Code/learning/README.md << 'EOF'
# Learning Journey

## Next.js Projects
- [ ] Personal blog with markdown
- [ ] E-commerce demo
- [ ] Dashboard with authentication

## Astro Projects  
- [ ] Static portfolio site
- [ ] Documentation site
- [ ] Multi-language blog

## Directus Projects
- [ ] Headless CMS for blog
- [ ] API for mobile app
- [ ] Content management system

## AI Coding Tips
- Use Copilot for boilerplate
- Ask AI to explain complex code
- Generate tests and documentation
- Refactor with AI assistance

## Useful Commands
- `new-next <project>` - Create Next.js project
- `new-astro <project>` - Create Astro project  
- `dev-env <path>` - Launch dev environment
EOF

print_success "Development environment setup complete!"
print_warning "Please reboot to ensure all changes take effect."
print_step "After reboot:"
echo "  1. Set i3 as your window manager"
echo "  2. Run 'dev-env ~/Code/learning' to start learning"
echo "  3. Create your first project with 'new-next my-first-app'"
echo ""
echo "Happy coding! 🚀"
