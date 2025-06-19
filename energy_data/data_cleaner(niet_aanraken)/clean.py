import pandas as pd
from datetime import datetime
import json

input_file = 'energy_data.csv'
cleaned_file = 'cleaned_energy_data.csv'
output_file = 'energy_data.json'

# Clean the data
df = pd.read_csv(input_file, sep=';', encoding='latin1', engine='python')

# Drop empty columns if all values are NaN.
df.dropna(axis=1, how='all', inplace=True)

# Rename columns better
df.columns = [
    'tijdstip',
    'zonnepaneelspanning',
    'zonnepaneelstroom',
    'waterstofproductie',
    'stroomverbruik_woning',
    'waterstofverbruik_auto',
    'buitentemperatuur',
    'binnentemperatuur',
    'luchtdruk',
    'luchtvochtigheid',
    'accuniveau',
    'co2_concentratie_binnen',
    'waterstofopslag_woning',
    'waterstofopslag_auto'
]

# Replace commas with periods and convert to numeric
for col in df.columns[1:]:  # Skip tijdstip cause it's datetime
    df[col] = df[col].astype(str).str.replace(',', '.') # Replace commas with periods
    df[col] = pd.to_numeric(df[col], errors='coerce') # Convert to numeric, change errors to NaN

# Fix datetime format
df['tijdstip'] = pd.to_datetime(df['tijdstip'], format='%d-%m-%Y %H:%M')

# Save to cleaned CSV (optional)
df.to_csv(cleaned_file, index=False)
print(f"Cleaned CSV saved as {cleaned_file}")

# Step 2: Process for JSON

# Split 'tijdstip' into 'date' and 'time' columns
if 'tijdstip' in df.columns:
    df['tijdstip'] = df['tijdstip'].astype(str)
    df['date'] = df['tijdstip'].str.split(' ').str[0]
    df['time'] = df['tijdstip'].str.split(' ').str[1]
    df = df.drop('tijdstip', axis=1)
else:
    print("Warning: 'tijdstip' column not found in the data.")

# Convert to JSON
df.to_json(output_file, orient='records', lines=False, indent=4)

print(f"JSON file saved as {output_file}")