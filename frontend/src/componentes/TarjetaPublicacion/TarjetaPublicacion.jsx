import styles from './tarjeta.module.css';

export const TarjetaPublicacion = ({ item }) => {
  return (
    <div className={styles.tarjeta}>
      {item.tipo === 'video' ? (
        <div className={styles.videoWrapper}>
          <iframe src={item.url} title={item.titulo} allowFullScreen></iframe>
        </div>
      ) : (
        <img src={item.imagen} alt={item.titulo} className={styles.imagen} />
      )}
      <div className={styles.info}>
        <h3>{item.titulo}</h3>
        <span className={styles.fecha}>{new Date(item.fecha).toLocaleDateString('es-ES')}</span>
      </div>
    </div>
  );
};