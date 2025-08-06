const dragonsImages = import.meta.glob('../assets/Dragons/*.png', {
  eager: true, // carga inmediata
  import: 'default',
});

const dragons = Object.entries(dragonsImages).map(([path, image]) => {
  const fileName = path.split('/').pop().replace('.webp', '');
  const nombre = fileName.charAt(0).toUpperCase() + fileName.slice(1);
  console.log(dragons)
  return {
    id: fileName.toLowerCase(), // id en minúscula
    nombre,
    imagen: image,
  };
  
});

export default dragons;