<template>
  <span 
    :class="iconClasses"
    :style="iconStyles"
    role="img"
    :aria-label="ariaLabel"
  >
    {{ iconCharacter }}
  </span>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'BaseIcon',
  props: {
    name: {
      type: String,
      required: true
    },
    size: {
      type: [String, Number],
      default: 'medium',
      validator: (value) => {
        if (typeof value === 'number') return value > 0
        return ['small', 'medium', 'large', 'xl'].includes(value)
      }
    },
    color: {
      type: String,
      default: null
    },
    clickable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    ariaLabel: {
      type: String,
      default: null
    }
  },
  emits: ['click'],
  setup(props, { emit }) {
    // 아이콘 맵핑
    const iconMap = {
      // 기본 액션
      'play': '▶️',
      'pause': '⏸️',
      'stop': '⏹️',
      'reset': '🔄',
      'refresh': '🔄',
      'reload': '🔃',
      
      // 미디어 컨트롤
      'step-forward': '⏭️',
      'step-backward': '⏮️',
      'fast-forward': '⏩',
      'rewind': '⏪',
      'record': '⏺️',
      
      // 네비게이션
      'home': '🏠',
      'back': '⬅️',
      'forward': '➡️',
      'up': '⬆️',
      'down': '⬇️',
      'left': '⬅️',
      'right': '➡️',
      'menu': '☰',
      'close': '❌',
      'expand': '📂',
      'collapse': '📁',
      
      // 기능
      'add': '➕',
      'remove': '➖',
      'delete': '🗑️',
      'edit': '✏️',
      'save': '💾',
      'download': '⬇️',
      'upload': '⬆️',
      'copy': '📋',
      'paste': '📄',
      'cut': '✂️',
      'search': '🔍',
      'filter': '🔽',
      'sort': '📊',
      'settings': '⚙️',
      'tools': '🔧',
      'info': 'ℹ️',
      'warning': '⚠️',
      'error': '❌',
      'success': '✅',
      'check': '✓',
      'clear': '🧹',
      
      // 카테고리
      'array': '📊',
      'graph': '🌐',
      'tree': '🌳',
      'string': '📝',
      'visited-array': '🗺️',
      
      // 알고리즘
      'sorting': '📈',
      'searching': '🔍',
      'traversal': '🚶',
      'path': '🛤️',
      'shortest-path': '📏',
      
      // 상태
      'loading': '⏳',
      'pending': '⏰',
      'completed': '✅',
      'running': '🏃',
      'paused': '⏸️',
      'stopped': '⏹️',
      
      // 파일
      'file': '📄',
      'folder': '📁',
      'image': '🖼️',
      'video': '📹',
      'audio': '🎵',
      
      // 사용자
      'user': '👤',
      'users': '👥',
      'profile': '👤',
      
      // 기타
      'heart': '❤️',
      'star': '⭐',
      'bookmark': '🔖',
      'tag': '🏷️',
      'link': '🔗',
      'external-link': '🔗',
      'lock': '🔒',
      'unlock': '🔓',
      'eye': '👁️',
      'eye-off': '🙈',
      'light': '💡',
      'dark': '🌙',
      'sun': '☀️',
      'moon': '🌙',
      'help': '❓',
      'question': '❓',
      'exclamation': '❗',
      'bell': '🔔',
      'notification': '🔔',
      'message': '💬',
      'chat': '💬',
      'mail': '📧',
      'phone': '📞',
      'location': '📍',
      'calendar': '📅',
      'clock': '🕐',
      'timer': '⏰'
    }

    const iconCharacter = computed(() => {
      return iconMap[props.name] || '❓'
    })

    const iconClasses = computed(() => [
      'base-icon',
      {
        'base-icon--clickable': props.clickable && !props.disabled,
        'base-icon--disabled': props.disabled
      }
    ])

    const sizeValue = computed(() => {
      if (typeof props.size === 'number') {
        return `${props.size}px`
      }
      
      const sizeMap = {
        small: '1rem',
        medium: '1.25rem',
        large: '1.5rem',
        xl: '2rem'
      }
      
      return sizeMap[props.size] || sizeMap.medium
    })

    const iconStyles = computed(() => ({
      fontSize: sizeValue.value,
      color: props.color || undefined
    }))

    const handleClick = (event) => {
      if (!props.disabled && props.clickable) {
        emit('click', event)
      }
    }

    return {
      iconCharacter,
      iconClasses,
      iconStyles,
      handleClick
    }
  }
}
</script>

<style scoped>
.base-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  user-select: none;
  line-height: 1;
  transition: all 0.2s ease;
}

.base-icon--clickable {
  cursor: pointer;
}

.base-icon--clickable:hover {
  transform: scale(1.1);
}

.base-icon--clickable:active {
  transform: scale(0.95);
}

.base-icon--disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-icon--disabled:hover {
  transform: none;
}
</style> 