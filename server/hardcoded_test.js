const admin = require('firebase-admin');
const bcrypt = require('bcryptjs');

const key = `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDZwxHa3cIJYyX3
x4aQ5WRXYOl3Ki8RskHEVyArc33oXvbn0WXqakCRm47AqIH7QUCoPpusPxOIc8To
xosHj0s/QBgaY9anQGbXnk0TSzfMBHZmruv8L84HjPqj1xR8goIzlfkbtdxHnZKC
8mgaUxWSGFgcCgvka0VyxzWdxUyAHW+6FBJKafdxMdfJCjZLTUJl4mpPuLXwlLmi
c7ekgCoUc4qpWoUKni+xXc749ehd3heaDWFFmixXpt+Plj8s/y9hNHCvREB8Hq+D
kNS/ovY5RRDH0YfM6I+5A/7d1lKdETEiimqdFKjeP2Ey1yhFv8fCbimwASzuTusn
CQaaDmxXAgMBAAECggEAHB3x2j6z5R5mMp4So/bag+XBf191AGXx0/Yj8zhQU4af
fsMs052whJx/TCT104lTXeXnl8/1J7M7A4tPPESmRJ5z/kRR3PqVzNVlwk3+AFu7
JfsEAWXyxkrPugP1YzY+tYZxycArlxujZUEDbBK6QEjgZ45shqvLJczPAXYOMKRf
Ts02DUiB5mjYAlY3BYFTM6esIZFhsR/HdG/nhJDL3xp9Fm5VLL3QzA8Xb6tk6GKC
uJKBeoQA9sy5syBkJ6qujU0rlt8E1m0rcJjujMUQMw+YSGR40OsPO4Qj/1kE1pmN
L9Z8li2tkRIBxudYgZcQhHyumslOyLdj+60vaJovAQKBgQD5RCgKs4DT5xSEa0Ir
Y5dOB6shjfuK/dLWTeyRhFEn/A3YKt7sAcgygVvhrBLffbNtwN3sWS/6iys77zFa
qE/n2a6jdAMLAIDwjSv9uPFG35BbL5fLawGCReTiDHKMGFdDWlI6nHTFVFK3f13a
YmtiFClHX2SiwHUlxbwgNUvFFwKBgQDfpQpRNcgwGNNA/1M5rz+Vdx4uRzq9W2NM
yQVdiOjeZmDZ2wOBdxulJ8g4PnYbViuomwJB4t7djOaZKdxK1PNXgOAcITgFVkit
yS9RcDpWlaxhIQGcRbXq0q3cRhMdmQtgRwyrxvRc1Ip/Ms34Pnbh2ij1NXJw05Ic
ambDfPmawQKBgE9qd5dxOUpKBS9rPNm2ES67Irq+EbZmyBWfHg/+qBylIYQNpJhs
uOveaveraxfpZJFDMXFruO2KCWw++Op5VXv4zrsk6xNGRc5eK/XaRoTeFY/3ydT1
crWerx2V+ajI2ISM8kXaMxnrk68C1VQOp0fIRJ6Itfdkee5e4WEhmdJhAoGBAKy5
MzGrPtPeqHFfgDBh59KQr8+AFZ6fER8BddJaZbc2DIDUxG1dxw0Tn2/I1cChGZDb
PrAR/pvPMV2DVe65bsLa9rri8Pg2PmVxpsjXy0aJzBsruamusSQN2FbyC9tlEsMl
vGSCgMGdKOW6IBckbv5ZVh6jS6JV1Fd72agLQl9BAoGBAMtEFkEMt/P7HdfKqtja
D204dYS2IW/zx5P4itkoOL4PzHeyAduO80VyACMyiLmCUcvhRUWhmmnWHPyIv4ym
hWtb1Yvizm4vxRNn6DWfJvamftvnDEb8bxuDXvotlJZwOTMXAARYLMykXObjp2Dd
dQ6QU+zH89S6E7GjPIEifcWm
-----END PRIVATE KEY-----`;

async function run() {
    try {
        admin.initializeApp({
            credential: admin.credential.cert({
                project_id: 'ecomerse-e830d',
                private_key: key,
                client_email: 'firebase-adminsdk-fbsvc@ecomerse-e830d.iam.gserviceaccount.com'
            })
        });
        const db = admin.firestore();
        const hashedPassword = await bcrypt.hash('NurseryAdmin@2025!', 10);
        await db.collection('users').doc('admin_id_here').set({
            name: 'Admin User',
            email: 'admin@nursery.com',
            password: hashedPassword,
            role: 'admin',
            createdAt: new Date()
        }, { merge: true });
        console.log('✅ Success!');
    } catch (e) {
        console.error('FAILED:', e.message);
    }
}
run();
