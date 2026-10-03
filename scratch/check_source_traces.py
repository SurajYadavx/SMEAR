import os
import glob
import re

active_files = []
for ext in ["*.html", "src/**/*.js", "src/**/*.css", "public/**/*.js", "public/**/*.html", "public/**/*.css"]:
    active_files.extend(glob.glob(os.path.join(r"D:\FF\Smear", ext), recursive=True))

patterns = re.compile(r"Metropolis|metropolisindia|BookMyTest|bookmytest|TruHealth|sourceData|health-tests\.json|packages\.json|package-categories\.json|shop\.html|shop\.js|v5-shop\.css|content/packages\.js", re.IGNORECASE)

matches = []
for file in set(active_files):
    # filter out excluded dirs
    file_path = file.replace("\\", "/")
    if any(x in file_path for x in ["/migration_backup/", "/metropolis_data/", "/data/", "/node_modules/", "/scratch/"]):
        continue
    if "scratch_detailed_content.html" in file_path:
        continue
        
    try:
        with open(file, "r", encoding="utf-8") as f:
            for i, line in enumerate(f):
                if patterns.search(line):
                    matches.append(f"{file}:{i+1}: {line.strip()}")
    except Exception as e:
        pass

for m in matches:
    print(m)
print(f"Total active matches: {len(matches)}")
