

// ************************ Styles ************************
import styles from "./FourSmall.module.css";

const FourSmall = ({ squares }) => {
    return (
        <div className={styles.container}>
            {squares && squares.map((square, index) => (
                <div 
                    key={index}
                    className={styles.square}
                >
                    <h3>{square.value}</h3>
                    <p>{square.title}</p>
                </div>
            ))}
        </div>
    )
}

export default FourSmall;