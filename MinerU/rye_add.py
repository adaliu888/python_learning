with open("python_learning/MinerU/requirements_old.txt", encoding="utf-16") as f:
    pkgs = [line.strip() for line in f if line.strip() and not line.startswith("#")]
print("rye add " + " ".join(pkgs))