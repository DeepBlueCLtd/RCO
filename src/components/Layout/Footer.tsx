import React from 'react';
import preval from 'preval.macro';

const Footer = (): React.ReactElement => {
	const buildDate = preval`module.exports = new Date().toISOString().slice(0, 19).replace('T', ' ')`;
	const trimmedAppBuildDate = buildDate.substring(0, buildDate.length - 3);

	return (
		<div
			style={{
				position: 'absolute',
				width: '100%',
				bottom: '0',
				zIndex: '20',
				left: '0',
				padding: '5px',
				backgroundColor: '#1F3860',
			}}
		>
			<span style={{ color: 'white', textAlign: 'left', marginLeft: '5px' }}>
				{trimmedAppBuildDate}
			</span>
		</div>
	);
};

export default Footer;
