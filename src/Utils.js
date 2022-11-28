export const formatState = (state) => {
   let stateFormated = { color: '', text: '' }
   switch (state) {
      case 'CONFIRMADA':
         stateFormated = { color: '#40a9ff', text: 'Confirmada' };
         break;
      case 'LISTA_PARA_RETIRAR':
         stateFormated = { color: '#85a5ff', text: 'Lista para retirar' };
         break;
      case 'LISTA_PARA_ENTREGAR':
         stateFormated = { color: '#bae637', text: 'Lista para entregar' };
         break;
      case 'EN_VIAJE':
         stateFormated = { color: '#73d13d', text: 'En viaje' };
         break;
      case 'ENTREGADA':
         stateFormated = { color: 'green', text: 'Entregada' };
         break;
      case 'ENTREGA_FALLIDA':
         stateFormated = { color: '#ffec3d', text: 'Entrega fallida' };
         break;
      case 'CANCELADA':
         stateFormated = { color: 'volcano', text: 'Cancelada' };
         break;
      default:
         break;
   }
   return stateFormated
};
