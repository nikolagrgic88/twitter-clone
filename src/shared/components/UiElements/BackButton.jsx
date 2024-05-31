import { useNavigate } from 'react-router-dom';

const BackButton = () => {
	const navigate = useNavigate();
	return (
		<div>
			<button
				onClick={() => navigate('..')}
				style={{
					backgroundColor: 'transparent',
					border: 'none',
					cursor: 'pointer',
					padding: '10px 0 10px 25px',
				}}
			>
				<ion-icon name='arrow-back-outline' size={'large'}></ion-icon>
			</button>
		</div>
	);
};
export default BackButton;
