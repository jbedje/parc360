# 🚀 Guide de Déploiement - PARC360 sur Contabo VPS

## ✅ Problème Résolu

Les erreurs 401 sur les pages Assurances, Analytique, Utilisateurs et Paramètres sont maintenant corrigées!

**Cause**: URLs hardcodées `http://localhost:5000` au lieu d'utiliser `REACT_APP_API_URL`
**Solution**: Utilisation du service API centralisé qui respecte les variables d'environnement

---

## 🔧 Étapes sur votre VPS Contabo

### 1. Mettre à jour le code

\`\`\`bash
cd /votre/chemin/parc360
git pull origin main
\`\`\`

### 2. Vérifier votre .env

\`\`\`env
REACT_APP_API_URL=http://VOTRE_IP_VPS:5000/api
MONGODB_URI=mongodb://user:pass@mongodb:27017/parc360
JWT_SECRET=VotreCleSecrete
\`\`\`

### 3. Reconstruire le frontend

\`\`\`bash
docker-compose build --no-cache frontend
docker-compose up -d frontend
\`\`\`

### 4. Vérifier

\`\`\`bash
docker-compose logs -f frontend
\`\`\`

---

## ✅ Test

Accédez à http://VOTRE_IP_VPS et testez:
- ✅ Page Assurances
- ✅ Page Analytique  
- ✅ Page Utilisateurs
- ✅ Page Paramètres

Plus d'erreurs 401!

---

**© 2025 PARC360**
