// champions.js
const championImages = import.meta.glob('../assets/Champions/*.png', {
  eager: true, // carga inmediata
  import: 'default',
});

const champions = Object.entries(championImages).map(([path, image]) => {
  const fileName = path.split('/').pop().replace('.png', '');
  const nombre = fileName.charAt(0).toUpperCase() + fileName.slice(1); // ahri → Ahri
  return {
    id: fileName.toLowerCase(), // id en minúscula
    nombre,
    imagen: image,
  };
});

export default champions;
