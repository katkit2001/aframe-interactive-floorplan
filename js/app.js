/* global AFRAME, HOUSE, ENTITIES */

// Το A-Frame animation component δέχεται μόνο ονομαστικά (Penner) easings,
// όχι custom cubic-bezier() strings· easeOutCubic/easeInOutCubic είναι τα πιο
// κοντινά σε "πρωτότυπο", αντίστοιχα με τις καμπύλες του css/style.css.
var EASE_OUT = 'easeOutCubic';
var EASE_IN_OUT = 'easeInOutCubic';

// ---------------------------------------------------------------------------
// Custom A-Frame component: μία οντότητα "έξυπνου σπιτιού" (φως, συσκευή,
// πόρτα, παράθυρο, αισθητήρας). Χειρίζεται το κλικ, αλλάζει οπτικά την
// κατάσταση και ενημερώνει το info panel μέσω custom event.
// ---------------------------------------------------------------------------
AFRAME.registerComponent('interactive-entity', {
  schema: {
    type: { type: 'string', default: 'light' },
    label: { type: 'string', default: '' },
    desc: { type: 'string', default: '' },
    unit: { type: 'string', default: '' },
    value: { type: 'string', default: '' }
  },

  init: function () {
    this.state = (this.data.type === 'door' || this.data.type === 'window') ? 'closed' : 'off';
    this.currentValue = this.data.value;

    this.onClick = this.onClick.bind(this);
    this.onEnter = this.onEnter.bind(this);
    this.onLeave = this.onLeave.bind(this);

    this.el.classList.add('clickable');
    this.el.addEventListener('click', this.onClick);
    this.el.addEventListener('mouseenter', this.onEnter);
    this.el.addEventListener('mouseleave', this.onLeave);

    this.applyVisualState();
  },

  onEnter: function () {
    if (this.data.type === 'door') { return; }
    this.hovering = true;
    this.el.setAttribute('animation__hover', {
      property: 'scale', to: '1.08 1.08 1.08', dur: 140, easing: EASE_OUT
    });
  },

  onLeave: function () {
    if (this.data.type === 'door') { return; }
    this.hovering = false;
    this.el.setAttribute('animation__hover', {
      property: 'scale', to: '1 1 1', dur: 140, easing: EASE_OUT
    });
  },

  onClick: function () {
    const t = this.data.type;
    if (t === 'light' || t === 'switch') {
      this.state = this.state === 'on' ? 'off' : 'on';
    } else if (t === 'door' || t === 'window') {
      this.state = this.state === 'open' ? 'closed' : 'open';
    } else if (t === 'sensor') {
      const base = parseFloat(this.data.value) || 0;
      this.currentValue = (base + (Math.random() * 2 - 1)).toFixed(1);
    }
    this.pressPulse();
    this.applyVisualState();
    this.broadcastInfo();
  },

  // Σύντομος "press" παλμός (πάτημα-χαλάρωση) στο κλικ, για απτική ανάδραση —
  // ίδιο κανάλι (scale) με το hover ώστε να μη συγκρούονται τα δύο animation.
  pressPulse: function () {
    if (this.data.type === 'door') { return; }
    const el = this.el;
    const restScale = this.hovering ? '1.08 1.08 1.08' : '1 1 1';
    el.setAttribute('animation__hover', { property: 'scale', to: '0.92 0.92 0.92', dur: 90, easing: EASE_OUT });
    setTimeout(function () {
      el.setAttribute('animation__hover', { property: 'scale', to: restScale, dur: 150, easing: EASE_OUT });
    }, 90);
  },

  applyVisualState: function () {
    const t = this.data.type;
    const el = this.el;

    if (t === 'light') {
      const on = this.state === 'on';
      el.setAttribute('material', {
        color: on ? '#ffd57a' : '#555555',
        emissive: on ? '#ffb84d' : '#000000'
      });
      // Το emissiveIntensity ανιμάρεται ξεχωριστά (βλ. animation__glow) ώστε
      // το φως να φαίνεται να "ανάβει" σταδιακά αντί να αλλάζει απότομα.
      el.setAttribute('animation__glow', {
        property: 'material.emissiveIntensity',
        to: on ? 0.9 : 0,
        dur: on ? 180 : 120,
        easing: EASE_OUT
      });
      let light = el.querySelector('a-light');
      if (on && !light) {
        light = document.createElement('a-light');
        light.setAttribute('type', 'point');
        light.setAttribute('intensity', '0');
        light.setAttribute('distance', '6');
        light.setAttribute('color', '#ffd28a');
        el.appendChild(light);
        light.setAttribute('animation', {
          property: 'light.intensity', to: 0.6, dur: 180, easing: EASE_OUT
        });
      } else if (!on && light) {
        light.parentNode.removeChild(light);
      }
    } else if (t === 'switch') {
      const on = this.state === 'on';
      el.setAttribute('material', {
        color: on ? '#3ea1ff' : '#111111',
        emissive: on ? '#3ea1ff' : '#000000'
      });
      el.setAttribute('animation__glow', {
        property: 'material.emissiveIntensity',
        to: on ? 0.6 : 0,
        dur: on ? 180 : 120,
        easing: EASE_OUT
      });
    } else if (t === 'door') {
      const open = this.state === 'open';
      el.setAttribute('material', {
        color: open ? '#a5754a' : '#6b4a2c',
        transparent: true
      });
      el.setAttribute('animation__scale', {
        property: 'scale', to: open ? '0.12 1 1' : '1 1 1', dur: 220, easing: EASE_IN_OUT
      });
      el.setAttribute('animation__opacity', {
        property: 'material.opacity', to: open ? 0.55 : 1, dur: 220, easing: EASE_IN_OUT
      });
    } else if (t === 'window') {
      const open = this.state === 'open';
      el.setAttribute('material', { color: open ? '#bfe6d8' : '#9fd0e8', transparent: true, side: 'double' });
      el.setAttribute('animation__opacity', {
        property: 'material.opacity', to: open ? 0.25 : 0.7, dur: 220, easing: EASE_IN_OUT
      });
    } else if (t === 'sensor') {
      el.setAttribute('material', { color: '#dcdcdc' });
    }
  },

  broadcastInfo: function () {
    this.el.sceneEl.emit('entity-selected', {
      label: this.data.label,
      type: this.data.type,
      state: this.state,
      desc: this.data.desc,
      value: this.currentValue,
      unit: this.data.unit
    }, false);
  }
});

// ---------------------------------------------------------------------------
// Δημιουργία της σκηνής (τοίχοι, δάπεδα, ετικέτες δωματίων, entities) από τα
// δηλωτικά δεδομένα layout.js / entities.js.
// ---------------------------------------------------------------------------
function buildHouse() {
  const wallsContainer = document.getElementById('walls');
  const floorsContainer = document.getElementById('floors');
  const entitiesContainer = document.getElementById('entities');

  let wallsHTML = '';
  HOUSE.walls.forEach(function (w) {
    wallsHTML +=
      '<a-box position="' + w.x + ' ' + (HOUSE.wallHeight / 2) + ' ' + w.z + '" ' +
      'width="' + w.w + '" height="' + HOUSE.wallHeight + '" depth="' + HOUSE.wallThickness + '" ' +
      'rotation="0 ' + w.rotY + ' 0" color="#efe9dd"></a-box>';
  });
  wallsContainer.insertAdjacentHTML('beforeend', wallsHTML);

  let floorsHTML = '';
  HOUSE.rooms.forEach(function (r) {
    floorsHTML +=
      '<a-plane position="' + r.x + ' 0.01 ' + r.z + '" rotation="-90 0 0" ' +
      'width="' + r.w + '" height="' + r.d + '" color="' + r.color + '"></a-plane>' +
      '<a-text value="' + r.name + '" position="' + r.label.x + ' ' + r.label.y + ' ' + r.label.z + '" ' +
      'align="center" color="#3a3a3a" width="4"></a-text>';
  });
  floorsContainer.insertAdjacentHTML('beforeend', floorsHTML);

  ENTITIES.forEach(function (e) {
    const el = document.createElement('a-entity');
    el.setAttribute('id', e.id);
    el.setAttribute('geometry', e.geometry);
    el.setAttribute('position', e.position);
    el.setAttribute('rotation', e.rotation || '0 0 0');
    el.setAttribute('material', 'color: #888888');
    el.setAttribute('interactive-entity', {
      type: e.type,
      label: e.label,
      desc: e.desc,
      unit: e.unit || '',
      value: e.value || ''
    });
    entitiesContainer.appendChild(el);
  });
}

// ---------------------------------------------------------------------------
// UI: info panel + οδηγίες χρήσης.
// ---------------------------------------------------------------------------
function wireUI(scene) {
  const panel = document.getElementById('info-panel');
  const panelTitle = document.getElementById('info-title');
  const panelBody = document.getElementById('info-body');
  const panelClose = document.getElementById('info-close');
  const instructions = document.getElementById('instructions');
  const startBtn = document.getElementById('start-btn');
  const helpBtn = document.getElementById('help-btn');

  const TYPE_LABELS = { light: 'Φως', switch: 'Συσκευή', door: 'Πόρτα', window: 'Παράθυρο', sensor: 'Αισθητήρας' };
  const STATE_LABELS = { on: 'ΑΝΟΙΧΤΟ', off: 'ΚΛΕΙΣΤΟ', open: 'ΑΝΟΙΧΤΗ/Ο', closed: 'ΚΛΕΙΣΤΗ/Ο' };

  scene.addEventListener('entity-selected', function (evt) {
    const d = evt.detail;
    panelTitle.textContent = d.label;

    const isActive = d.state === 'on' || d.state === 'open';
    const stateLine = (d.type === 'sensor')
      ? 'Τιμή: ' + d.value + ' ' + d.unit
      : 'Κατάσταση: ' + (STATE_LABELS[d.state] || d.state);
    const stateColor = d.type === 'sensor' ? '#26291f' : (isActive ? '#3f6b4a' : '#8a8a8a');

    panelBody.innerHTML =
      '<span class="tag">' + (TYPE_LABELS[d.type] || d.type) + '</span>' +
      '<p>' + d.desc + '</p>' +
      '<p class="state-line" style="color:' + stateColor + '">' + stateLine + '</p>';

    panel.classList.add('visible');
  });

  panelClose.addEventListener('click', function () {
    panel.classList.remove('visible');
  });

  startBtn.addEventListener('click', function () {
    instructions.classList.add('hidden');
  });

  helpBtn.addEventListener('click', function () {
    instructions.classList.remove('hidden');
  });
}

document.addEventListener('DOMContentLoaded', function () {
  buildHouse();
  wireUI(document.querySelector('a-scene'));
});
