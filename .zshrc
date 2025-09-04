# If you come from bash you might have to change your $PATH.
export PATH=$HOME/bin:$HOME/.local/bin:/usr/local/bin:$PATH

# Path to your Oh My Zsh installation.
export ZSH="$HOME/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time Oh My Zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/ohmyzsh/ohmyzsh/wiki/Themes
ZSH_THEME="jonathan"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in $ZSH/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment one of the following lines to change the auto-update behavior
# zstyle ':omz:update' mode disabled  # disable automatic updates
# zstyle ':omz:update' mode auto      # update automatically without asking
# zstyle ':omz:update' mode reminder  # just remind me to update when it's time

# Uncomment the following line to change how often to auto-update (in days).
# zstyle ':omz:update' frequency 13

# Uncomment the following line if pasting URLs and other text is messed up.
# DISABLE_MAGIC_FUNCTIONS="true"

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# You can also set it to another string to have that shown instead of the default red dots.
# e.g. COMPLETION_WAITING_DOTS="%F{yellow}waiting...%f"
# Caution: this setting can cause issues with multiline prompts in zsh < 5.7.1 (see #5765)
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder

# Which plugins would you like to load?
# Standard plugins can be found in $ZSH/plugins/
# Custom plugins may be added to $ZSH_CUSTOM/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(git zsh-autosuggestions zsh-syntax-highlighting docker docker-compose node npm python conda)
source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
# if [[ -n $SSH_CONNECTION ]]; then
#   export EDITOR='vim'
# else
#   export EDITOR='nvim'
# fi

# Compilation flags
# export ARCHFLAGS="-arch $(uname -m)"

# Set personal aliases, overriding those provided by Oh My Zsh libs,
# plugins, and themes. Aliases can be placed here, though Oh My Zsh
# users are encouraged to define aliases within a top-level file in
# the $ZSH_CUSTOM folder, with .zsh extension. Examples:
# - $ZSH_CUSTOM/aliases.zsh
# - $ZSH_CUSTOM/macos.zsh
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
export VISUAL=nano
export EDITOR=nano
# Personalizzazione del prompt per Zsh
# Funzione per mostrare il branch di Git
parse_git_branch() {
    git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/( \1)/'
}

# Definizione del prompt (PS1)
PROMPT="%F{green}%n%F{white}@%F{cyan}%m%F{white}:%F{yellow}%c%F{red}\$(parse_git_branch)%F{white}$ "
alias docker="podman"
alias docker-compose="podman-compose"
alias docker="podman"
alias docker-compose="podman-compose"
alias docker="podman"
alias docker-compose="podman-compose"
alias mcp-start="~/Code/configs/mcp/start-mcp-servers.sh"
alias mcp-stop="docker stop \$(docker ps -q --filter name=mcp-*)"
alias mcp-status="docker ps --filter name=mcp-*"
alias mcp-list="claude mcp list"
export ANTHROPIC_API_KEY="sk-ant-api03-mE4jeosa6KEMBQkNnTesq_jp8rpXn2a6kkeKPO_L-PeDU9BuLIBoRhNQ6ZBaGqiquOB0rzuLIpKJuT2KV9AZDQ-z3aCSAwAA"

# === Development Environment Setup ===
export CODE_DIR="$HOME/Code"

# Aliases per sviluppo
alias code-dir="cd $CODE_DIR"
alias dev-start="$CODE_DIR/tools/scripts/dev-env.sh start"
alias dev-stop="$CODE_DIR/tools/scripts/dev-env.sh stop"
alias dev-restart="$CODE_DIR/tools/scripts/dev-env.sh restart"
alias dev-status="$CODE_DIR/tools/scripts/dev-env.sh status"
alias dev-logs="$CODE_DIR/tools/scripts/dev-env.sh logs"

# Editor shortcuts
alias c="cursor"
alias c.="cursor ."

# Claude Code shortcuts  
alias cc="claude"
alias cc-help="claude --help"

# Docker/Podman shortcuts
alias d="docker"
alias dc="docker-compose"
alias dps="docker ps"
alias dl="docker logs"

# Quick project creation
function new-project() {
    if [[ -z "$1" ]]; then
        echo "Usage: new-project <project-name> [ai|web|api]"
        return 1
    fi
    
    local project_name=$1
    local project_type=${2:-web}
    local project_path="$CODE_DIR/${project_type}-projects/$project_name"
    
    mkdir -p "$project_path"
    cd "$project_path"
    
    git init
    echo "# $project_name" > README.md
    mkdir -p {src,tests,docs,config}
    
    cursor .
    echo "✅ Progetto $project_name creato in $project_path"
}

# Quick navigation to projects
function goto-project() {
    local project=$(find $CODE_DIR -maxdepth 3 -type d -name "*$1*" | head -1)
    if [[ -n "$project" ]]; then
        cd "$project"
        echo "📂 $project"
    else
        echo "❌ Project not found: $1"
    fi
}
