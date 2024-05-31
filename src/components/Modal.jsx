import React, { useState } from 'react';
import { motion } from 'framer-motion';
import classes from './Modal.module.css';
import Backdrop from './Backdrop';

const Modal = ({ children, handleClose, optional }) => {
	// const handleCloseModal = (event) => {
	// 	if (event.target === event.currentTarget) {
	// 		handleClose();
	// 	}
	// };

	const dropIn = {
		hidden: {
			y: '-100vh',
			opacity: 0,
		},
		visible: {
			y: '0',
			opacity: 1,
			transition: {
				duration: 0.5,
				type: 'spring',
				damping: 25,
				stiffness: 500,
			},
		},
		exit: {
			y: '100vh',
			opacity: 0,
			transition: {
				duration: 0.5,
			},
		},
	};

	return (
		<Backdrop onClick={handleClose}>
			<motion.div
				onClick={(e) => e.stopPropagation()}
				className={classes.modal}
				variants={dropIn}
				initial='hidden'
				animate='visible'
				exit='exit'
			>
				<div className={classes.childrenElement}>
					{optional && (
						<button onClick={handleClose} className={classes.closeBtn}>
							X
						</button>
					)}
					<div>{children}</div>
				</div>
			</motion.div>
		</Backdrop>
	);
};

export default Modal;
