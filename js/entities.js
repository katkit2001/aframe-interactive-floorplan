// Δηλωτική περιγραφή των διαδραστικών οντοτήτων ("έξυπνο σπίτι").
// Κάθε entity ξέρει τη θέση, το είδος (light / switch / door / window / sensor)
// και τα μεταδεδομένα που θα εμφανιστούν στο info panel.

const ENTITIES = [
  {
    id: 'living-ceiling-light',
    type: 'light',
    label: 'Φως Οροφής Σαλονιού',
    desc: 'Κεντρικός φωτισμός LED, θερμό λευκό φως.',
    position: '-3 2.35 0',
    geometry: 'primitive: sphere; radius: 0.14'
  },
  {
    id: 'living-lamp',
    type: 'light',
    label: 'Πορτατίφ Σαλονιού',
    desc: 'Πορτατίφ δίπλα στον καναπέ.',
    position: '-5.2 0.95 -3.2',
    geometry: 'primitive: cone; radiusBottom: 0.28; radiusTop: 0.05; height: 0.4'
  },
  {
    id: 'living-tv',
    type: 'switch',
    label: 'Τηλεόραση',
    desc: 'Smart TV 55" στο σαλόνι.',
    position: '-5.85 1.3 0',
    rotation: '0 90 0',
    geometry: 'primitive: box; width: 0.06; height: 0.7; depth: 1.2'
  },
  {
    id: 'kitchen-ceiling-light',
    type: 'light',
    label: 'Φως Οροφής Κουζίνας',
    desc: 'Κεντρικός φωτισμός LED κουζίνας.',
    position: '3 2.35 2',
    geometry: 'primitive: sphere; radius: 0.14'
  },
  {
    id: 'kitchen-fridge',
    type: 'sensor',
    label: 'Ψυγείο',
    desc: 'Έξυπνο ψυγείο με αισθητήρα θερμοκρασίας.',
    unit: '°C',
    value: '4',
    position: '5.5 0.9 3.4',
    geometry: 'primitive: box; width: 0.8; height: 1.8; depth: 0.7'
  },
  {
    id: 'bedroom-ceiling-light',
    type: 'light',
    label: 'Φως Οροφής Υπνοδωματίου',
    desc: 'Κεντρικός φωτισμός LED υπνοδωματίου.',
    position: '3 2.35 -2',
    geometry: 'primitive: sphere; radius: 0.14'
  },
  {
    id: 'bedroom-lamp',
    type: 'light',
    label: 'Πορτατίφ Κομοδίνου',
    desc: 'Πορτατίφ πάνω στο κομοδίνο.',
    position: '5.3 0.7 -3.3',
    geometry: 'primitive: cone; radiusBottom: 0.22; radiusTop: 0.04; height: 0.3'
  },
  {
    id: 'bedroom-window',
    type: 'window',
    label: 'Παράθυρο Υπνοδωματίου',
    desc: 'Παράθυρο με αισθητήρα ανοίγματος.',
    position: '5.89 1.6 -2',
    rotation: '0 90 0',
    geometry: 'primitive: plane; width: 1.4; height: 1.2'
  },
  {
    id: 'front-door',
    type: 'door',
    label: 'Εξώπορτα',
    desc: 'Κύρια είσοδος του σπιτιού.',
    position: '-3 1.3 3.9',
    geometry: 'primitive: box; width: 1.1; height: 2.6; depth: 0.12'
  }
];
