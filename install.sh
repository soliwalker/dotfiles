#!/bin/bash
# Script per creare i symlink dai dotfiles alla posizione corretta.

# Directory dove si trova lo script (e i tuoi dotfiles)
DOTFILES_DIR=~/.dotfiles

echo "Inizio installazione dei dotfiles..."

# Crea i link per i file nella home directory
# -s: simbolico, -f: forza la creazione (sovrascrive se esiste già), -v: verboso (mostra cosa fa)
ln -sfv "$DOTFILES_DIR/gitconfig" ~/.gitconfig
# Aggiungi qui altri file come .bashrc, .zshrc, etc.
# Esempio: ln -sfv "$DOTFILES_DIR/bashrc" ~/.bashrc

# Crea i link per le cartelle di configurazione
# Prima ci assicuriamo che la cartella .config esista
mkdir -p ~/.config
ln -sfv "$DOTFILES_DIR/sway" ~/.config/sway
# Aggiungi qui altre cartelle come alacritty, rofi, etc.
# Esempio: ln -sfv "$DOTFILES_DIR/alacritty" ~/.config/alacritty

echo "Installazione dei dotfiles completata."
# Link per i file nella home
ln -sfv "$DOTFILES_DIR/.zshrc" "/home/chris/.zshrc"
ln -sfv "$DOTFILES_DIR/rofi" "/home/chris/.config/rofi"
ln -sfv "$DOTFILES_DIR/.config" "/home/chris/.config/.config"
