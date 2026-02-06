const { db, admin } = require('../config/db');

class Counter {
    static async findOneAndUpdate({ id }, { $inc }, options) {
        // Use a transaction/atomic update to simulate auto-increment
        const counterRef = db.collection('counters').doc(id);

        try {
            const doc = await counterRef.get();
            if (!doc.exists) {
                // Initialize if not exists
                await counterRef.set({ seq: 1 });
                return { seq: 1 };
            }

            // Atomically increment
            await counterRef.update({
                seq: admin.firestore.FieldValue.increment($inc.seq)
            });

            // Return the new value (get it again or calculate)
            // FieldValue.increment is write-only in the logic, we need to read it back?
            // Actually, to implement "return new document" pattern:

            const updatedDoc = await counterRef.get();
            return { seq: updatedDoc.data().seq };

        } catch (error) {
            throw error;
        }
    }
}

module.exports = Counter;
