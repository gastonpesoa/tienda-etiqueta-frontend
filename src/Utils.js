export const formatState = (state) => {
   let stateFormated = { color: '', text: '', description: '' }
   switch (state) {
      case 'CONFIRMADA':
         stateFormated = { color: '#40a9ff', text: 'Confirmada', description: 'Realizaste la compra el', description_seller: 'Compra realizada el' };
         break;
      case 'LISTA_PARA_RETIRAR':
         stateFormated = { color: '#85a5ff', text: 'Lista para retirar', description: 'Tu compra está lista para que la retires por sucursal desde el', description_seller: 'Compra lista para ser retirada por sucursal el' };
         break;
      case 'LISTA_PARA_ENTREGAR':
         stateFormated = { color: '#bae637', text: 'Lista para entregar', description: 'Tu compra está lista para ser entregada desde el', description_seller: 'Compra lista para ser entregada desde el' };
         break;
      case 'EN_VIAJE':
         stateFormated = { color: '#73d13d', text: 'En viaje', description: 'Tu compra está en viaje desde el', description_seller: 'Compra en viaje desde el' };
         break;
      case 'ENTREGADA':
         stateFormated = { color: 'green', text: 'Entregada', description: 'Recibiste la compra el', description_seller: 'Compra entregada el' };
         break;
      case 'ENTREGA_FALLIDA':
         stateFormated = { color: '#ffec3d', text: 'Entrega fallida', description: 'Intentamos entregar la compra el', description_seller: 'Intento de entrega fallido el' };
         break;
      case 'CANCELADA':
         stateFormated = { color: 'volcano', text: 'Cancelada', description: 'Tu compra fué cancelada el', description_seller: 'Compra cancelada el' };
         break;
      default:
         break;
   }
   return stateFormated
};

export const formatDate = (date) => {
   try {
      let d = new Date(date);
      let ye = new Intl.DateTimeFormat('es', { year: 'numeric' }).format(d);
      let mo = new Intl.DateTimeFormat('es', { month: 'long' }).format(d);
      let da = new Intl.DateTimeFormat('es', { day: '2-digit' }).format(d);
      return `${da} de ${mo} ${ye}`
   } catch (error) {
      console.log("error parsing date", error)
      return ''
   }
}

export const toBase64 = file => new Promise((resolve, reject) => {
   const reader = new FileReader();
   reader.readAsDataURL(file);
   reader.onload = () => resolve(reader.result);
   reader.onerror = error => reject(error);
});
