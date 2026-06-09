# 📚 AskMyPDF

An AI-powered PDF Question Answering application built with Next.js that allows users to upload PDF documents and interact with them using natural language. The application extracts content from PDFs and uses AI to provide accurate answers based on the uploaded document.

## 🚀 Live Demo

Add your deployed application link here:

```text
https://your-app.vercel.app
```

## ✨ Features

* 📄 Upload PDF documents
* 🤖 AI-powered question answering
* 💬 Chat with your PDF in natural language
* 🔍 Context-aware responses
* ⚡ Fast document processing
* 📱 Fully responsive design
* 🎨 Modern and intuitive UI
* 🔒 Secure file handling
* 📚 Support for multiple document queries

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

### Backend

* Next.js API Routes
* Node.js

### AI & Data Processing

* OpenAI API / Gemini API
* LangChain
* Vector Database (Pinecone/ChromaDB)
* PDF Parsing Libraries

## 📂 Project Structure

```bash
askmyPdf/
│
├── app/
├── components/
├── lib/
├── actions/
├── hooks/
├── public/
├── types/
│
├── package.json
├── next.config.ts
├── tsconfig.json
└── README.md
```

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/Kundank8789/askmyPdf.git
```

### Navigate to Project

```bash
cd askmyPdf
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env.local` file:

```env
OPENAI_API_KEY=your_api_key
DATABASE_URL=your_database_url
```

## ▶️ Running the Application

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

## 🎯 How It Works

1. Upload a PDF document.
2. The application extracts and processes the content.
3. Text is converted into searchable embeddings.
4. Ask questions related to the document.
5. Receive AI-generated answers based on the PDF content.

## 📸 Screenshots

### Upload PDF

```md
![Upload PDF](./public/screenshots/upload.png)
```

### Chat Interface

```md
![Chat Interface](./public/screenshots/chat.png)
```

### AI Response

```md
![AI Response](./public/screenshots/response.png)
```

## 🌟 Future Enhancements

* Multiple PDF uploads
* PDF summarization
* Citation and source highlighting
* Export chat history
* User authentication
* Team collaboration
* Support for Word and PowerPoint documents

## 🔧 Available Scripts

```bash
npm run dev
```

Runs the development server.

```bash
npm run build
```

Creates a production build.

```bash
npm run start
```

Runs the production server.

```bash
npm run lint
```

Checks code quality and linting issues.

## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/new-feature
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push to GitHub

```bash
git push origin feature/new-feature
```

5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👨‍💻 Author

Kulbhushan Kumar

GitHub: https://github.com/Kundank8789

LinkedIn: Add Your LinkedIn Profile

---

⭐ If you found this project useful, please give it a star on GitHub.

