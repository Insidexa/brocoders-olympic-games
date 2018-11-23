## How to use
1. Put `athlete_events.csv` in `storage` directory
2. Put `olympic_history.db` in `storage` directory
3. Import

    NPM -> `npm run import` or CLI manual `./bin/import`    
4. Statistics 

    Run as `npm run stat` or `./bin/stat`
   - `top-teams`
   - `medals`
   
   Examples:
   
   - `npm run stat medals summer ukr`
   - `./bin/stat medals silver UKR winter`
   - `npm run stat top-teams summer 2004 silver` 
   - `npm run stat top-teams silver winter`
   - `./bin/stat top-teams winter`