const { db } = require('../config/db');

class User {
    constructor(data) {
        this.id = data.id || null;
        this.name = data.name;
        this.email = data.email;
        this.password = data.password;
        this.role = data.role || 'user';
        this.createdAt = data.createdAt || new Date();
    }

    static async findOne({ email }) {
        if (!email) return null;
        const snapshot = await db.collection('users').where('email', '==', email).limit(1).get();
        if (snapshot.empty) return null;
        const doc = snapshot.docs[0];
        return new User({ id: doc.id, ...doc.data() });
    }

    static async findById(id) {
        if (!id) return null;
        const doc = await db.collection('users').doc(id).get();
        if (!doc.exists) return null;
        return new User({ id: doc.id, ...doc.data() });
    }

    static async find() {
        const snapshot = await db.collection('users').get();
        return snapshot.docs.map(doc => new User({ id: doc.id, ...doc.data() }));
    }

    async save() {
        const userData = {
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            createdAt: this.createdAt
        };

        if (this.id) {
            await db.collection('users').doc(this.id).set(userData, { merge: true });
        } else {
            const res = await db.collection('users').add(userData);
            this.id = res.id;
        }
        return this;
    }
}

module.exports = User;
