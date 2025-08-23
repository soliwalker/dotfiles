#!/bin/bash
# Dell Precision 5550 Specific Configuration
# Additional setup for hardware optimization

print_step "Configuring Dell Precision 5550 specific settings..."

# NVIDIA Drivers
print_step "Installing NVIDIA drivers..."
sudo dnf install -y akmod-nvidia xorg-x11-drv-nvidia-cuda
sudo dnf install -y nvidia-settings nvidia-modprobe

# Enable RPM Fusion for NVIDIA drivers
sudo dnf install -y https://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$(rpm -E %fedora).noarch.rpm
sudo dnf install -y https://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$(rpm -E %fedora).noarch.rpm

# Dell specific packages
sudo dnf install -y dell-command-configure

# Power management optimization
sudo dnf install -y tlp tlp-rdw
sudo systemctl enable tlp.service
sudo systemctl start tlp.service

# Touchscreen support (optional with i3)
sudo dnf install -y xorg-x11-drv-libinput

# High DPI scaling configuration
print_step "Configuring 4K display scaling..."

# Create X11 configuration for scaling
sudo mkdir -p /etc/X11/xorg.conf.d/
sudo tee /etc/X11/xorg.conf.d/90-monitor.conf > /dev/null << EOF
Section "Monitor"
    Identifier "eDP-1"
    Option "PreferredMode" "3840x2400"
    Option "DPMS" "true"
EndSection

Section "Screen"
    Identifier "Screen0"
    Monitor "eDP-1"
    Option "metamodes" "3840x2400_60 +0+0 { ForceFullCompositionPipeline = On }"
EndSection
EOF

# Configure GTK scaling
echo 'export GDK_SCALE=2' >> ~/.profile
echo 'export QT_AUTO_SCREEN_SCALE_FACTOR=1' >> ~/.profile
echo 'export QT_SCALE_FACTOR=2' >> ~/.profile

# Configure i3 for high DPI
mkdir -p ~/.config/i3
cat >> ~/.config/i3/config << EOF

# High DPI configuration for Dell Precision 5550
exec_always --no-startup-id xrandr --output eDP-1 --mode 3840x2400 --rate 60
exec_always --no-startup-id xrdb -merge ~/.Xresources

# Cursor size for high DPI
exec_always --no-startup-id xsetroot -cursor_name left_ptr

# Font scaling
font pango:JetBrains Mono 12

EOF

# Create .Xresources for DPI settings
cat > ~/.Xresources << EOF
! High DPI settings for Dell Precision 5550
Xft.dpi: 192
Xft.autohint: 0
Xft.lcdfilter: lcddefault
Xft.hintstyle: hintslight
Xft.hinting: 1
Xft.antialias: 1
Xft.rgba: rgb

! Cursor theme and size
Xcursor.theme: Adwaita
Xcursor.size: 32
EOF

# Alacritty configuration for high DPI
mkdir -p ~/.config/alacritty
cat >> ~/.config/alacritty/alacritty.yml << EOF

# High DPI settings for Dell Precision 5550
font:
  size: 14.0  # Larger font for 4K display

window:
  decorations: none
  opacity: 0.95
  
# Better for high DPI touchscreen
mouse:
  hide_when_typing: true
EOF

# Rofi configuration for high DPI
mkdir -p ~/.config/rofi
cat > ~/.config/rofi/config.rasi << EOF
configuration {
    dpi: 192;
    font: "JetBrains Mono 14";
}
EOF

# Disable nouveau (open source NVIDIA driver)
echo 'blacklist nouveau' | sudo tee /etc/modprobe.d/blacklist-nouveau.conf
echo 'options nouveau modeset=0' | sudo tee -a /etc/modprobe.d/blacklist-nouveau.conf

# Regenerate initramfs
sudo dracut --regenerate-all --force

print_success "Dell Precision 5550 optimization complete!"
print_warning "Reboot required for NVIDIA drivers and scaling to take effect."

# Touchscreen utilities (optional)
print_step "Installing touchscreen utilities..."
sudo dnf install -y onboard  # Virtual keyboard
sudo dnf install -y xdotool   # Touch gesture tools

# Battery optimization for laptop
print_step "Configuring power management..."
cat > /tmp/tlp-dell << 'EOF'
# Dell Precision specific TLP configuration
SOUND_POWER_SAVE_ON_AC=0
SOUND_POWER_SAVE_ON_BAT=1
SOUND_POWER_SAVE_CONTROLLER=Y

WIFI_PWR_ON_AC=off
WIFI_PWR_ON_BAT=on

CPU_SCALING_GOVERNOR_ON_AC=performance
CPU_SCALING_GOVERNOR_ON_BAT=powersave

CPU_ENERGY_PERF_POLICY_ON_AC=performance
CPU_ENERGY_PERF_POLICY_ON_BAT=power

CPU_MIN_PERF_ON_AC=0
CPU_MAX_PERF_ON_AC=100
CPU_MIN_PERF_ON_BAT=0
CPU_MAX_PERF_ON_BAT=30

# NVIDIA power management
RUNTIME_PM_ON_AC=on
RUNTIME_PM_ON_BAT=auto
EOF

sudo cp /tmp/tlp-dell /etc/tlp.d/01-dell-precision.conf

# Create useful scripts for this laptop
cat > ~/.local/bin/toggle-display-scale << 'EOF'
#!/bin/bash
# Toggle between 4K native and scaled resolution
current_scale=$(xrandr | grep "3840x2400" | wc -l)
if [ $current_scale -eq 1 ]; then
    # Switch to 1920x1200 (scaled)
    xrandr --output eDP-1 --mode 1920x1200
    notify-send "Display" "Switched to 1920x1200 (scaled)"
else
    # Switch back to 4K
    xrandr --output eDP-1 --mode 3840x2400
    notify-send "Display" "Switched to 4K native"
fi
EOF

cat > ~/.local/bin/toggle-gpu << 'EOF'
#!/bin/bash
# Toggle between Intel and NVIDIA GPU (if using optimus)
current_gpu=$(prime-select query 2>/dev/null || echo "nvidia")
if [ "$current_gpu" = "nvidia" ]; then
    sudo prime-select intel
    notify-send "GPU" "Switched to Intel GPU (power saving)"
else
    sudo prime-select nvidia
    notify-send "GPU" "Switched to NVIDIA GPU (performance)"
fi
echo "Restart required to take effect"
EOF

chmod +x ~/.local/bin/toggle-*

print_success "Dell Precision 5550 specific scripts created!"
echo ""
echo "🎯 Hardware-specific features:"
echo "  • toggle-display-scale - Switch between 4K and scaled resolution"
echo "  • toggle-gpu - Switch between Intel/NVIDIA GPU"
echo "  • Touchscreen support enabled"
echo "  • Battery optimization configured"
echo ""
