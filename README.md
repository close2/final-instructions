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
1.  **To Create/Edit:** Go to the [Secure Instructions Web Tool](https://secure-instructions.hexe.monster/secure-instructions.html). For technical reasons, the "creation" part requires the file to be served via a local web server (like `python -m http.server`) if you are running it from your own computer.
2.  **To Decrypt/Read:** Simply **double-click** the HTML file you created. Your browser will open it, and you can enter the passwords to see the contents. No special setup is needed for the people receiving your vault.

---

### 🚀 Recommendation
The easiest way to create your secure vault is to use our privacy-respecting version:

👉 **[https://secure-instructions.hexe.monster/secure-instructions.html](https://secure-instructions.hexe.monster/secure-instructions.html)**

*(Note: Even when using this link, your data stays in your browser and is never sent to our servers.)*


## Github and Gitlab Repositories
- GitHub: [https://github.com/close2/secure-instructions](https://github.com/close2/secure-instructions)
- GitLab: [https://gitlab.com/close2/final-instructions](https://gitlab.com/close2/final-instructions)

## License and Credits

This project is licensed under the MIT License.

This application includes the **secrets.js** library by **amper5and** (Alexander Stetsyuk) and others, which implements Shamir's Secret Sharing.

**secrets.js** is licensed under the MIT License:

> Copyright (c) 2014 Alexander Stetsyuk
>
> Permission is hereby granted, free of charge, to any person obtaining a copy
> of this software and associated documentation files (the "Software"), to deal
> in the Software without restriction, including without limitation the rights
> to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
> copies of the Software, and to permit persons to whom the Software is
> furnished to do so, subject to the following conditions:
>
> The above copyright notice and this permission notice shall be included in all
> copies or substantial portions of the Software.
>
> THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
> IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
> FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
> AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
> LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
> OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
> SOFTWARE.
