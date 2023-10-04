import styles from "./HomePage.module.scss";
import { Link } from 'react-router-dom';

const HomePage = () => {

    return (
        <div className={styles.main}>
            <p>Выбрать задания:</p>
            <div className={styles.tasks}>
                <Link to={`task1`}>Задание 1</Link>
                <Link to={`task2`}>Задание 2</Link>
            </div>
        </div>
    )
}

export default HomePage;