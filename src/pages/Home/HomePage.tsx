import styles from './HomePage.module.css';
import ClockIcon from '@icons/clock.svg?react';
import EditIcon from '@icons/edit.svg?react';
import BookIcon from '@icons/book.svg?react';

export const HomePage = () => {
	return (
		<>
			<h1 className={styles.heading}>Home Page</h1>
			<div>
				<img src='assets/icons/testIcon.svg' alt='' />
				<img src='assets/images/error-404.svg' alt='' />
				<img src='assets/images/error-500.svg' alt='' />
				<img src='assets/images/light-bulb.svg' alt='' />
			</div>
			<div>
				{/* <img src={TestIcon} alt="" /> */}
				<a className={styles.link} href='#'>
					<ClockIcon className={styles.icon} />
				</a>
				<a className={styles.link} href='#'>
					<BookIcon className={styles.icon} />
				</a>
				<a className={styles.link} href='#'>
					<EditIcon className={styles.icon} />
				</a>
			</div>
		</>
	);
}
