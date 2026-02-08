# 🛡️ Secure Instructions: Your Digital Emergency Vault

**Secure Instructions** is a simple, private way to ensure your most important information—like passwords, legal wishes, or "if I'm not here" steps—is only accessible when a specific group of people you trust come together.

Think of it like a **digital safety deposit box** that requires multiple physical keys to open.

---

### 🌟 Why use this? (The "In Case of Emergency" Vault)
Life is unpredictable. This tool is designed for scenarios where you need to pass on sensitive information safely:

* **Estate Planning:** "If I pass away, my spouse and my lawyer must both enter their passwords to see where my will and crypto keys are stored."
* **Medical Emergencies:** "If I fall into a coma, any 2 of my 3 children can combine their passwords to access my medical history and power of attorney documents."
* **Business Continuity:** "If the CEO is unavailable, 3 out of 5 board members can unlock the company’s emergency credentials."

---

### 🛠️ How it Works (Safety in Numbers)
Instead of one master password that could be stolen, you split the "key" into several pieces (called **Shares**).

You decide the math: For example, you give out 5 passwords, but require any 3 to unlock the file ($k=3, n=5$). This way, if one person is unavailable or loses their password, the vault can still be opened, but no single person can "snoop" on their own.

### 🔑 Master Key & Editing
When you create the vault, you will also get a **Master Key**. It allows you to re-open the document later to edit the contents. **Keep this safe!**

### ✍️ Digital Signatures (Important Note)
If the required number of people combine their passwords, they *can* create a new document that works with the same keys.
**This means:** This tool is great for *access control* (keeping secrets safe until needed), but it is **not** a replacement for a digital signature. A digital signature proves *who* wrote a document. This tool only protects *who can read it*.

---

### 📥 How to Share Your Vault
There are two ways to give your trusted people access. Each has pros and cons:

| Method                    | How it works                                                                      | Pros                                                                                 | Cons                                                                                  |
|:--------------------------|:----------------------------------------------------------------------------------|:-------------------------------------------------------------------------------------|:--------------------------------------------------------------------------------------|
| **The "Distributed" Way** | Send the HTML file and one password to everyone.                                  | **No single point of failure.** Everyone has the vault safely on their own computer. | If you update the instructions, you must send the **new** file to everyone again.     |
| **The "Central" Way**     | Put one file on a shared drive or USB stick. Give everyone their unique password. | **Easy updates.** You only manage one file.                                          | If the shared drive is deleted or the USB is lost, the instructions are gone forever. |

---

### 🔒 Is it Private?
**Yes. Absolutely.**
* **No Servers:** Your data is **never** sent to the internet. The "vault" is created entirely inside your web browser.
* **Offline-Ready:** Once you have the file, you don't even need an internet connection to open it.
* **No Traces:** Once you close the browser tab, your decrypted secrets vanish from the computer’s memory.

---

### 💡 How to Use It
1.  **To Create/Edit:** Go to the [Secure Instructions Web Tool](https://secure-instructions.hexe.monster/secure-instructions.html).
2.  **To Decrypt/Read:** Simply **double-click** the HTML file you created. Your browser will open it, and you can enter the passwords to see the contents. No special setup is needed for the people receiving your vault.

#### ⚠️ Important: Running Locally
If you want to run this tool offline to **create or edit** vaults, or if you want to modify an existing file you have downloaded, you **must** serve the file using a local web server.

**Why?**
Modern web browsers have strict security rules (CORS and Origin policies) that prevent web pages opened via `file://` (double-clicking) from performing certain actions, like robustly saving a new version of itself.

Since this is a **self-modifying HTML file**, the code that generates the new HTML file (including your encrypted tokens) is contained within the HTML file itself. When you save your vault, the application reads its own source code, injects your new encrypted data, and offers the updated file for download. This cycle ensures that the new file contains everything needed to run the application, including the logic to create *the next* version.


**How to run a local server:**
Open your terminal/command prompt in the folder where `secure-instructions.html` is located and run one of these commands:

*   **Python (Recommended):**
    ```bash
    python3 -m http.server
    ```
*   **Node.js:**
    ```bash
    npx http-server
    ```
*   **PHP:**
    ```bash
    php -S localhost:8080
    ```

Then open your browser to `http://localhost:8000` (or the port shown in your terminal).

---

### 🚀 Recommendation
The easiest way to create your secure vault is to use our privacy-respecting version:

👉 **[https://secure-instructions.hexe.monster/secure-instructions.html](https://secure-instructions.hexe.monster/secure-instructions.html)**

*(Note: Even when using this link, your data stays in your browser and is never sent to our servers.)*


### 📚 Similar Projects

During the polishing phase of this project, a similar tool called [Rememory](https://eljojo.github.io/rememory/) was featured on [Hacker News](https://news.ycombinator.com/item?id=46916609).

In the comments of that discussion, another pioneer in this space was mentioned: [Keybearer](https://michael-solomon.net/keybearer/), which dates back to 2012!


## 🐙 GitHub and GitLab Repositories
- GitHub: [https://github.com/close2/secure-instructions](https://github.com/close2/secure-instructions)
- GitLab: [https://gitlab.com/close2/final-instructions](https://gitlab.com/close2/final-instructions)

## ⚖️ License and Credits

### Project License
This project "Secure Instructions" is licensed under the **MIT License**.

### Third-Party Libraries
This application includes the **secrets.js** library, which implements Shamir's Secret Sharing. It is created by **amper5and** (Alexander Stetsyuk) and others.

**secrets.js** is also licensed under the **MIT License**:

> Copyright (c) 2014 Alexander Stetsyuk
> ... (full license text preserved) ...
