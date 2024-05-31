import React from 'react';

import styles from './Avatar.module.css';

const Avatar = (props) => {
	return (
		<div
			className={`${styles.avatar} ${props.className} `}
			style={props.style}
			onClick={props.disabled ? undefined : props.imageHandler}
		>
			<img
				src={props.image}
				alt={props.alt}
				style={{
					width: props.width,
					height: props.width,
					border: props.border,
				}}
			/>
		</div>
	);
};

export default Avatar;
