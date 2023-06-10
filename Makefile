DATA_DIR=src/_data
CSV_FILE=dates.csv
CSV_URL=https://docs.google.com/spreadsheets/d/e/2PACX-1vRiD0dFLdhmN1buxW1srjSjeH_lyma_hG7ixbxPqzl81HBWnB7Bh3X2DUNOHT96leK1kZZE0-2MLkX_/pub?gid=0&single=true&output=csv

download:
	@echo "Downloading CSV files..."
	@mkdir -p $(DATA_DIR)
	@rm -f $(DATA_DIR)/$(CSV_FILE)
	@curl '$(CSV_URL)' -L -o $(DATA_DIR)/$(CSV_FILE)
	@echo "Done."