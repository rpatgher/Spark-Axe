function formatDate (date) {
  return new Date(date).toLocaleString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }).replace(' ', ' de ');
}

export default formatDate;