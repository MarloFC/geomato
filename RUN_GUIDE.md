# How to Run GeoMato Ops on Another Computer

You have two main ways to run this application on a different machine.

## Option 1: Shared Static Build (Quickest & Easiest)
Use this if you just want to run the app without installing development tools on the other computer.

1.  **Copy the `build` folder**: Take the `build` folder from the current project and copy it to the other computer.
2.  **Serve it**:
    - If the other computer has Node.js:
      ```bash
      npm install -g serve
      serve -s build
      ```
    - Or simply open the `index.html` inside the `build` folder (though some features like routing work better with a simple server).

## Option 2: Full Source Code (Best for Development)
Use this if you want to continue working on the code on the other computer.

1.  **Install Node.js**: Make sure the other computer has Node.js installed (download from nodejs.org).
2.  **Copy the Project**: Copy the entire project folder (excluding `node_modules` to save space).
3.  **Install Dependencies**:
    Open a terminal in the project folder and run:
    ```bash
    npm install
    ```
4.  **Run the App**:
    ```bash
    npm start
    ```

## Important Note on Data
This app uses `localStorage` to save your data. This means:
- Data is saved **per computer** and **per browser**.
- If you want to keep your data when moving to another computer, use the **"Exportar Excel"** button to save your current work, and you'll have the `.xls` file as a backup.
