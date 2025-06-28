import React, { useCallback, useState } from "react";
import Model from "react-body-highlighter";
import data from "./data.json";
import { motion } from "framer-motion";
import "./Simulator.css";

export default function Simulator() {
	const [results, setResult] = useState([]);
	const [muscle, setMuscle] = useState("");

	const handleClick = useCallback(({ muscle, data }) => {
		const { exercises } = data;
		setMuscle(muscle);
		setResult(exercises || []);
	}, []);

	return (
		<>  
        <div></div>
			

			<div className="main-container">
                <div className="alert">
				<h2>Guess What!</h2>
				<p>You can learn more by clicking on a muscle!</p>
			</div>
				<div className="models">
					<Model
						data={data}
						style={{ width: "30vw", padding: "3rem" }}
						onClick={handleClick}
						highlightedColors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
						bodyColor="rgb(255, 255, 255)"
					/>
					<Model
						type="posterior"
						data={data}
						style={{ width: "30vw", padding: "3rem" }}
						onClick={handleClick}
						highlightedColors={["rgb(255, 255, 255)", "rgb(255, 255, 255)"]}
						bodyColor="rgb(255, 255, 255)"
					/>
				</div>

				<motion.div
					className="result-box"
					initial={{ opacity: 0, y: 50 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.5 }}
				>
					{results.length > 0 ? (
						<>
							<h1 className="result-title">{muscle}</h1>
							{results.map((result, i) => (
								<p key={i} className="exercise">{result}</p>
							))}
						</>
					) : (
						<p className="empty-msg">Nothing was found</p>
					)}
				</motion.div>
			</div>
		</>
	);
}
