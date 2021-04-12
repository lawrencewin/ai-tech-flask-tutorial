import { useState } from "react"
import "./App.css"

function App() {
	const [ text, setText ] = useState("Upload a picture to see if it's a cat or dog. No inbetween.")
	const [ file, setFile ] = useState(null)
	const [ base64, setBase64 ] = useState(null)

	const handleSubmit = async () => {
		const formData = new FormData()
		formData.append("image", file)
		const res = await fetch("/classify", {
			method: "POST",
			body: formData
		})
		const data = await res.json()
		if (data.output !== "idk") {
			setText(`${Math.round(data.probability * 1000) / 10}% sure this is a ${data.type}.`)
		}
	}

	const handleFileChange = (e) => {
		console.log(e.target.files)
		setFile(e.target.files[0])
		// Get base64 for image preview
		const reader = new FileReader()
		reader.addEventListener("load", () => {
			setBase64(reader.result)
		})
		if (e.target.files[0]) {
			reader.readAsDataURL(e.target.files[0])
		}
	}

	return (
		<div className="app">
			<h1>Cat or Dog?</h1>
			<div className="upload" >
				<input type="file" onChange={handleFileChange} />
				<input type="submit" value="Upload File" onClick={handleSubmit} />
			</div>
			<div className="result">{text}</div>
			{ base64 ? 
				<img src={base64} className="img" alt="Preview of upload" />
			: null }
		</div>
	)
}

export default App
