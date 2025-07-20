import React from 'react';
import './PlaceholderPage.css';

interface PlaceholderPageProps {
	title: string;
	description?: string;
}

const PlaceholderPage: React.FC<PlaceholderPageProps> = ({
	title,
	description,
}) => {
	return (
		<div className='placeholder-container'>
			<div className='placeholder-content'>
				<div className='placeholder-card'>
					<h1 className='placeholder-title'>{title}</h1>
					{description && (
						<p className='placeholder-description'>{description}</p>
					)}
					<div className='placeholder-development'>
						<p className='placeholder-development-text'>
							Эта страница находится в разработке
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default PlaceholderPage;
