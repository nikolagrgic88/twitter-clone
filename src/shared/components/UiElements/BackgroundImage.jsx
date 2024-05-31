import classes from './BackgroundImage.module.css';

const BackgroundImage = (props) => {
	const image = {
		img: 'https://media.istockphoto.com/id/1326144217/photo/temple-saint-sava.jpg?s=2048x2048&w=is&k=20&c=xxNIe_iF5JL1_XJqpEOW-4uCNiqZl_GXZYHWQKP1mKY=',
	};
	return (
		<div className={classes.backgroundImageContainer }>
			<img src={image.img} alt='Background image' />
		</div>
	);
};

export default BackgroundImage;
