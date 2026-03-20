package com.ecommerce;

import com.ecommerce.model.entity.Category;
import com.ecommerce.model.entity.Product;
import com.ecommerce.model.entity.User;
import com.ecommerce.model.enums.ApprovalStatus;
import com.ecommerce.model.enums.Role;
import com.ecommerce.repository.CategoryRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.UserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@SpringBootApplication
public class ShopKartApplication {

    public static void main(String[] args) {
        SpringApplication.run(ShopKartApplication.class, args);
    }

    @Bean
    CommandLineRunner initData(
            UserRepository userRepository,
            CategoryRepository categoryRepository,
            ProductRepository productRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {

            User admin;
            if (userRepository.findByEmail("admin@shopkart.com").isEmpty()) {
                admin = new User();
                admin.setName("Admin");
                admin.setEmail("admin@shopkart.com");
                admin.setPassword(passwordEncoder.encode("admin123"));
                admin.setRole(Role.ADMIN);
                admin.setActive(true);
                admin = userRepository.save(admin);
                System.out.println("Admin account created: admin@shopkart.com / admin123");
            } else {
                admin = userRepository.findByEmail("admin@shopkart.com").get();
            }

            User seller;
            if (userRepository.findByEmail("seller@shopkart.com").isEmpty()) {
                seller = new User();
                seller.setName("ShopKart Store");
                seller.setEmail("seller@shopkart.com");
                seller.setPassword(passwordEncoder.encode("seller123"));
                seller.setRole(Role.SELLER);
                seller.setActive(true);
                seller = userRepository.save(seller);
            } else {
                seller = userRepository.findByEmail("seller@shopkart.com").get();
            }

            List<String> categoryNames = Arrays.asList(
                "Electronics", "Fashion", "Home & Furniture", "Books",
                "Sports & Fitness", "Toys & Games", "Beauty & Personal Care",
                "Grocery", "Mobiles", "Appliances"
            );
            for (String name : categoryNames) {
                if (categoryRepository.findByName(name).isEmpty()) {
                    Category cat = new Category();
                    cat.setName(name);
                    categoryRepository.save(cat);
                }
            }
            System.out.println("Categories initialized");

            if (productRepository.count() > 0) {
                System.out.println("Products already exist, skipping seed.");
                return;
            }

            final User finalSeller = seller;

            // ── ELECTRONICS ────────────────────────────────────────
            Category electronics = categoryRepository.findByName("Electronics").get();
            Object[][] electronicsData = {
                {"Sony WH-1000XM5 Headphones", "Industry-leading noise canceling with Auto NC Optimizer", 24990, 34990, "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&fit=crop&auto=format"},
                {"Apple AirPods Pro", "Active Noise Cancellation, Transparency mode, Spatial Audio", 19990, 26900, "https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=500&fit=crop&auto=format"},
                {"Samsung 65\" 4K Smart TV", "Crystal UHD 4K, HDR, Smart TV with Alexa Built-in", 74990, 89990, "https://images.unsplash.com/photo-1593359677879-a4bb92f4834c?w=500&fit=crop&auto=format"},
                {"Canon EOS R50 Camera", "24.2MP APS-C CMOS Sensor, 4K Video, Wi-Fi & Bluetooth", 59990, 74990, "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=500&fit=crop&auto=format"},
                {"Dell XPS 15 Laptop", "12th Gen Intel Core i7, 16GB RAM, 512GB SSD, OLED Display", 149990, 179990, "https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=500&fit=crop&auto=format"},
                {"iPad Air 5th Gen", "M1 chip, 10.9-inch Liquid Retina display, 5G capable", 54900, 64900, "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=500&fit=crop&auto=format"},
                {"Bose SoundLink Speaker", "360 degrees of immersive, jaw-dropping sound", 9990, 13990, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&fit=crop&auto=format"},
                {"GoPro Hero 12 Black", "5.3K60 + 4K120 Video, HyperSmooth 6.0, Max Lens Mod 2.0", 39990, 49990, "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=500&fit=crop&auto=format"},
                {"PlayStation 5 Console", "Next-gen gaming with ultra-high speed SSD and DualSense controller", 54990, 59990, "https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=500&fit=crop&auto=format"},
                {"Apple Watch Series 9", "Advanced health sensors, Always-On Retina display, watchOS 10", 41900, 49900, "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&fit=crop&auto=format"},
                {"Logitech MX Master 3", "Advanced wireless mouse for Mac and PC, ultra-fast scrolling", 8995, 10995, "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500&fit=crop&auto=format"},
                {"Kindle Paperwhite", "Adjustable warm light, 6.8\" display, waterproof, 8GB storage", 13999, 16999, "https://images.unsplash.com/photo-1592899896224-b4e7e0a27ef2?w=500&fit=crop&auto=format"},
                {"Samsung Galaxy Tab S9", "11\" Dynamic AMOLED 2X display, Snapdragon 8 Gen 2, IP68", 72999, 84999, "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=500&fit=crop&auto=format"},
                {"Anker Power Bank 26800mAh", "Massive 26800mAh Capacity, High-Speed Charging, Dual Input", 3999, 5999, "https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=500&fit=crop&auto=format"},
                {"JBL Flip 6 Speaker", "Powerful sound with bold bass, IP67 waterproof and dustproof", 8999, 11999, "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, electronicsData, electronics, finalSeller);

            // ── FASHION ────────────────────────────────────────────
            Category fashion = categoryRepository.findByName("Fashion").get();
            Object[][] fashionData = {
                {"Men's Classic Oxford Shirt", "Premium cotton formal shirt with slim fit design", 1299, 2499, "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=500&fit=crop&auto=format"},
                {"Women's Floral Maxi Dress", "Elegant floral print maxi dress for all occasions", 1899, 3499, "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=500&fit=crop&auto=format"},
                {"Men's Slim Fit Chinos", "Stretch cotton chino pants, comfortable everyday wear", 1499, 2799, "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=500&fit=crop&auto=format"},
                {"Women's Leather Handbag", "Genuine leather handbag with multiple compartments", 3499, 5999, "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500&fit=crop&auto=format"},
                {"Men's Running Sneakers", "Lightweight breathable mesh upper, cushioned sole", 2999, 4999, "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&fit=crop&auto=format"},
                {"Women's Casual Kurti", "Printed cotton kurti with 3/4 sleeves, ethnic design", 799, 1499, "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&fit=crop&auto=format"},
                {"Men's Denim Jacket", "Classic blue denim jacket with button closure", 2499, 4499, "https://images.unsplash.com/photo-1551537482-f2075a1d41f2?w=500&fit=crop&auto=format"},
                {"Women's Yoga Pants", "High-waist compression leggings for workout and yoga", 1299, 2299, "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500&fit=crop&auto=format"},
                {"Men's Formal Blazer", "Premium wool blend blazer for professional occasions", 5999, 9999, "https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=500&fit=crop&auto=format"},
                {"Women's Sunglasses", "UV400 protection polarized sunglasses, trendy design", 999, 1999, "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=500&fit=crop&auto=format"},
                {"Men's Sports T-Shirt", "Dry-fit moisture wicking fabric, perfect for gym", 699, 1299, "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&fit=crop&auto=format"},
                {"Women's Ankle Boots", "Genuine leather ankle boots with block heel", 4499, 6999, "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=500&fit=crop&auto=format"},
                {"Men's Casual Shorts", "Cotton blend shorts with elastic waistband and pockets", 899, 1599, "https://images.unsplash.com/photo-1591195853828-11db59a44f43?w=500&fit=crop&auto=format"},
                {"Women's Ethnic Saree", "Banarasi silk saree with golden zari border, wedding special", 8999, 15999, "https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500&fit=crop&auto=format"},
                {"Men's Leather Wallet", "Genuine leather bifold wallet, RFID blocking", 999, 1999, "https://images.unsplash.com/photo-1627123424574-724758594785?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, fashionData, fashion, finalSeller);

            // ── HOME & FURNITURE ───────────────────────────────────
            Category home = categoryRepository.findByName("Home & Furniture").get();
            Object[][] homeData = {
                {"Wooden Coffee Table", "Solid sheesham wood coffee table with storage shelf", 8999, 14999, "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=500&fit=crop&auto=format"},
                {"Memory Foam Mattress", "5-inch orthopedic memory foam mattress, Queen size", 12999, 22999, "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=500&fit=crop&auto=format"},
                {"Ceramic Dinner Set", "12-piece ceramic dinner set with elegant floral design", 2499, 4499, "https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=500&fit=crop&auto=format"},
                {"Scented Candle Set", "Set of 6 luxury scented candles in glass jars", 1299, 2499, "https://images.unsplash.com/photo-1602178896271-1b1c9048a2e3?w=500&fit=crop&auto=format"},
                {"Wall Clock Wooden", "Large decorative wooden wall clock, silent movement", 1999, 3499, "https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?w=500&fit=crop&auto=format"},
                {"Sofa Set 3+1+1", "5-seater fabric sofa set with cushions, living room", 34999, 54999, "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=500&fit=crop&auto=format"},
                {"Curtains Set of 2", "Blackout curtains, thermal insulated, 7 feet length", 1799, 2999, "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&fit=crop&auto=format"},
                {"Stainless Steel Cookware Set", "7-piece non-stick cookware set with glass lids", 4999, 8999, "https://images.unsplash.com/photo-1584990347449-a2d4c2c044c9?w=500&fit=crop&auto=format"},
                {"Bedsheet Set King Size", "Cotton 500 thread count bedsheet with 2 pillow covers", 2499, 4499, "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?w=500&fit=crop&auto=format"},
                {"Indoor Plant Pot Set", "Set of 3 ceramic planters with bamboo tray", 1499, 2499, "https://images.unsplash.com/photo-1485955900006-10f4d324d411?w=500&fit=crop&auto=format"},
                {"LED Floor Lamp", "Modern dimmable floor lamp with 3 color temperatures", 3999, 6999, "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=500&fit=crop&auto=format"},
                {"Bathroom Accessories Set", "6-piece chrome bathroom accessories with soap dispenser", 2999, 4999, "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=500&fit=crop&auto=format"},
                {"Study Table with Shelf", "Engineered wood study table with bookshelf, walnut finish", 7999, 12999, "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=500&fit=crop&auto=format"},
                {"Photo Frame Set", "Set of 6 wooden photo frames in multiple sizes", 1299, 2299, "https://images.unsplash.com/photo-1513519245088-0e12902e35a6?w=500&fit=crop&auto=format"},
                {"Vacuum Cleaner Robot", "Smart robot vacuum with auto-charging, Wi-Fi control", 14999, 24999, "https://images.unsplash.com/photo-1518640467707-6811f4a6ab73?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, homeData, home, finalSeller);

            // ── BOOKS ──────────────────────────────────────────────
            Category books = categoryRepository.findByName("Books").get();
            Object[][] booksData = {
                {"Atomic Habits - James Clear", "An Easy & Proven Way to Build Good Habits & Break Bad Ones", 499, 799, "https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=500&fit=crop&auto=format"},
                {"The Psychology of Money", "Timeless lessons on wealth, greed, and happiness", 449, 699, "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&fit=crop&auto=format"},
                {"Rich Dad Poor Dad", "What the Rich Teach Their Kids About Money", 399, 599, "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=500&fit=crop&auto=format"},
                {"The Alchemist - Paulo Coelho", "A fable about following your dream", 299, 499, "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=500&fit=crop&auto=format"},
                {"Think and Grow Rich", "Napoleon Hill's timeless classic on success", 349, 549, "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=500&fit=crop&auto=format"},
                {"Deep Work - Cal Newport", "Rules for Focused Success in a Distracted World", 499, 799, "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=500&fit=crop&auto=format"},
                {"Zero to One - Peter Thiel", "Notes on Startups, or How to Build the Future", 549, 849, "https://images.unsplash.com/photo-1550399105-c4db5fb85c18?w=500&fit=crop&auto=format"},
                {"The Lean Startup", "How Today's Entrepreneurs Use Continuous Innovation", 499, 799, "https://images.unsplash.com/photo-1589998059171-988d887df646?w=500&fit=crop&auto=format"},
                {"Harry Potter Box Set", "Complete 7-book collection in premium hardcover", 3499, 5499, "https://images.unsplash.com/photo-1474932430478-367dbb6832c1?w=500&fit=crop&auto=format"},
                {"Clean Code - Robert Martin", "A Handbook of Agile Software Craftsmanship", 1299, 1999, "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=500&fit=crop&auto=format"},
                {"Sapiens - Yuval Noah Harari", "A Brief History of Humankind", 599, 899, "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=500&fit=crop&auto=format"},
                {"The 7 Habits - Stephen Covey", "7 Habits of Highly Effective People", 449, 699, "https://images.unsplash.com/photo-1507842217343-583bb7270b66?w=500&fit=crop&auto=format"},
                {"Start With Why - Simon Sinek", "How Great Leaders Inspire Everyone to Take Action", 399, 599, "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=500&fit=crop&auto=format"},
                {"The Subtle Art", "The Subtle Art of Not Giving a F*ck by Mark Manson", 349, 549, "https://images.unsplash.com/photo-1491841651911-c44484e46f09?w=500&fit=crop&auto=format"},
                {"Ikigai - Japanese Secret", "The Japanese Secret to a Long and Happy Life", 299, 499, "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, booksData, books, finalSeller);

            // ── SPORTS & FITNESS ───────────────────────────────────
            Category sports = categoryRepository.findByName("Sports & Fitness").get();
            Object[][] sportsData = {
                {"Yoga Mat Premium", "6mm thick non-slip yoga mat with carrying strap", 999, 1999, "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&fit=crop&auto=format"},
                {"Adjustable Dumbbells Set", "20kg adjustable dumbbell set with stand", 4999, 8999, "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&fit=crop&auto=format"},
                {"Cycling Helmet", "Lightweight aerodynamic cycling helmet with ventilation", 1999, 3499, "https://images.unsplash.com/photo-1557803175-474063930435?w=500&fit=crop&auto=format"},
                {"Sports Water Bottle", "1 liter BPA-free water bottle with time markings", 699, 1299, "https://images.unsplash.com/photo-1523362628745-0c100150b504?w=500&fit=crop&auto=format"},
                {"Resistance Bands Set", "Set of 5 resistance bands with different tensions", 799, 1499, "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&fit=crop&auto=format"},
                {"Football Nike Premier", "FIFA approved match football, size 5", 2499, 3999, "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=500&fit=crop&auto=format"},
                {"Badminton Racket Set", "Set of 2 carbon fiber badminton rackets with shuttlecocks", 3499, 5999, "https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?w=500&fit=crop&auto=format"},
                {"Jump Rope Speed", "Professional speed jump rope with ball bearings", 599, 999, "https://images.unsplash.com/photo-1434608519344-49d77a699e1d?w=500&fit=crop&auto=format"},
                {"Gym Gloves", "Anti-slip weight lifting gloves with wrist support", 799, 1499, "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&fit=crop&auto=format"},
                {"Treadmill Folding", "Motorized folding treadmill with LED display, 12 programs", 29999, 49999, "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?w=500&fit=crop&auto=format"},
                {"Cricket Bat English Willow", "Grade 1 English willow cricket bat, full size", 4999, 8999, "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&fit=crop&auto=format"},
                {"Swimming Goggles", "UV protection anti-fog swimming goggles", 799, 1499, "https://images.unsplash.com/photo-1530549387789-4c1017266635?w=500&fit=crop&auto=format"},
                {"Protein Shaker Bottle", "700ml leak-proof shaker with mixing ball", 499, 899, "https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=500&fit=crop&auto=format"},
                {"Knee Support Brace", "Compression knee brace for sports and arthritis", 699, 1299, "https://images.unsplash.com/photo-1598289431512-b97b0917affc?w=500&fit=crop&auto=format"},
                {"Foam Roller Massage", "High density foam roller for muscle recovery", 1299, 2299, "https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, sportsData, sports, finalSeller);

            // ── TOYS & GAMES ───────────────────────────────────────
            Category toys = categoryRepository.findByName("Toys & Games").get();
            Object[][] toysData = {
                {"LEGO Classic Creative Bricks", "900 pieces colorful LEGO bricks for ages 4+", 3499, 5499, "https://images.unsplash.com/photo-1587654780291-39c9404d746b?w=500&fit=crop&auto=format"},
                {"Remote Control Car", "1:16 scale RC car with 2.4GHz control, 30km/h speed", 2999, 4999, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&fit=crop&auto=format"},
                {"Monopoly Board Game", "Classic Monopoly property trading game for family", 1499, 2499, "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500&fit=crop&auto=format"},
                {"Barbie Dream House", "3-story Barbie house with 8 rooms and accessories", 7999, 12999, "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=500&fit=crop&auto=format"},
                {"Chess Set Wooden", "Premium wooden chess set with folding board", 1999, 3499, "https://images.unsplash.com/photo-1586165368502-1bad197a6461?w=500&fit=crop&auto=format"},
                {"Nerf Rival Blaster", "High-impact rounds blaster with 25-round capacity", 2499, 3999, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&fit=crop&auto=format"},
                {"Play-Doh Mega Set", "65-piece Play-Doh set with tools and molds", 1799, 2999, "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=500&fit=crop&auto=format"},
                {"Hot Wheels Track Set", "200-piece Hot Wheels ultimate garage playset", 4999, 7999, "https://images.unsplash.com/photo-1594736797933-d0501ba2fe65?w=500&fit=crop&auto=format"},
                {"Rubik's Cube 3x3", "Original Rubik's Speed Cube, smooth rotation", 699, 1299, "https://images.unsplash.com/photo-1591200256612-54f3c9e2e4ab?w=500&fit=crop&auto=format"},
                {"Jigsaw Puzzle 1000pcs", "1000-piece landscape jigsaw puzzle for adults", 999, 1799, "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500&fit=crop&auto=format"},
                {"Stuffed Teddy Bear", "Super soft 60cm teddy bear, perfect gift", 1299, 2299, "https://images.unsplash.com/photo-1559454403-b8fb88521f11?w=500&fit=crop&auto=format"},
                {"Nintendo Switch Lite", "Compact gaming system for handheld play", 19990, 24990, "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500&fit=crop&auto=format"},
                {"Art & Craft Kit", "100-piece art and craft kit for kids ages 6+", 1499, 2499, "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=500&fit=crop&auto=format"},
                {"Scrabble Classic", "Classic word game Scrabble for 2-4 players", 1299, 1999, "https://images.unsplash.com/photo-1611996575749-79a3a250f948?w=500&fit=crop&auto=format"},
                {"Drone Mini Quadcopter", "Mini drone with one-key takeoff, 360° flip, LED lights", 3499, 5999, "https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, toysData, toys, finalSeller);

            // ── BEAUTY & PERSONAL CARE ─────────────────────────────
            Category beauty = categoryRepository.findByName("Beauty & Personal Care").get();
            Object[][] beautyData = {
                {"Lakme 9to5 Foundation", "Full coverage liquid foundation with SPF, 30ml", 599, 999, "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&fit=crop&auto=format"},
                {"Nivea Body Lotion 400ml", "Deep moisture body lotion with Shea Butter", 299, 499, "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=500&fit=crop&auto=format"},
                {"Biotique Face Serum", "Bio White Advanced Fairness Serum, 30ml", 449, 699, "https://images.unsplash.com/photo-1570194065650-d99fb4b8ccb0?w=500&fit=crop&auto=format"},
                {"Mamaearth Vitamin C Kit", "Vitamin C face wash, serum and moisturizer combo", 799, 1299, "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=500&fit=crop&auto=format"},
                {"L'Oreal Hair Color", "Garnier natural black hair color, ammonia free", 349, 549, "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&fit=crop&auto=format"},
                {"Philips Hair Dryer 2000W", "Thermoprotect technology, 2 speed and 3 heat settings", 1999, 3499, "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=500&fit=crop&auto=format"},
                {"Colorbar Matte Lipstick", "Long-lasting matte lipstick in 20 shades", 599, 899, "https://images.unsplash.com/photo-1586495777744-4e6fbb7a2f8e?w=500&fit=crop&auto=format"},
                {"Dove Shampoo + Conditioner", "Intensive repair duo pack for damaged hair, 650ml each", 699, 1099, "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=500&fit=crop&auto=format"},
                {"Sugar Cosmetics Eyeshadow", "21-shade eyeshadow palette with metallic and matte", 999, 1599, "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=500&fit=crop&auto=format"},
                {"Gillette Fusion Razor", "5-blade razor with precision trimmer, 2 cartridges", 599, 999, "https://images.unsplash.com/photo-1621786030484-4c855eed6974?w=500&fit=crop&auto=format"},
                {"Forest Essentials Face Wash", "Ayurvedic deep cleansing face wash with Neem and Tulsi", 795, 1295, "https://images.unsplash.com/photo-1556228578-dd24e2e45e7a?w=500&fit=crop&auto=format"},
                {"Beardo Beard Oil", "Nourishing beard oil with argan and jojoba oil, 30ml", 449, 699, "https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=500&fit=crop&auto=format"},
                {"WOW Skin Science Kit", "Apple Cider Vinegar shampoo and conditioner set", 699, 1099, "https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=500&fit=crop&auto=format"},
                {"Nykaa Nail Polish Set", "Set of 12 trendy nail polish shades", 799, 1299, "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=500&fit=crop&auto=format"},
                {"Braun Electric Shaver", "Series 5 electric shaver with 3 flexible blades", 4999, 7999, "https://images.unsplash.com/photo-1621786030484-4c855eed6974?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, beautyData, beauty, finalSeller);

            // ── GROCERY ────────────────────────────────────────────
            Category grocery = categoryRepository.findByName("Grocery").get();
            Object[][] groceryData = {
                {"Tata Salt 1kg", "Pure iodized salt, vacuum evaporated", 28, 35, "https://images.unsplash.com/photo-1519676867240-f03562e64548?w=500&fit=crop&auto=format"},
                {"Aashirvaad Atta 5kg", "Select whole wheat flour with natural goodness", 235, 299, "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=500&fit=crop&auto=format"},
                {"Fortune Sunflower Oil 5L", "100% pure sunflower oil, cholesterol free", 699, 849, "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=500&fit=crop&auto=format"},
                {"Tata Tea Gold 500g", "Premium blend of upper Assam CTC leaf tea", 299, 399, "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=500&fit=crop&auto=format"},
                {"Nescafe Classic Coffee 200g", "Intense rich aroma and great taste, 200g jar", 449, 599, "https://images.unsplash.com/photo-1559496417-e7f25cb247f3?w=500&fit=crop&auto=format"},
                {"Amul Butter 500g", "Pasteurised butter made from cow milk", 280, 320, "https://images.unsplash.com/photo-1589985270958-bf087b4ef54b?w=500&fit=crop&auto=format"},
                {"Parle-G Biscuits 1kg", "World's largest selling biscuit brand, glucose biscuits", 99, 140, "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&fit=crop&auto=format"},
                {"Maggi Noodles 12 Pack", "12-pack Masala Maggi noodles family pack", 199, 260, "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=500&fit=crop&auto=format"},
                {"MDH Garam Masala 100g", "Blended spices for authentic Indian cooking", 89, 129, "https://images.unsplash.com/photo-1532336414038-cf19250c5757?w=500&fit=crop&auto=format"},
                {"Basmati Rice Premium 5kg", "Extra long grain aged basmati rice", 549, 699, "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=500&fit=crop&auto=format"},
                {"Kissan Mixed Fruit Jam 1kg", "Mixed fruit jam with real fruit pieces", 199, 279, "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=500&fit=crop&auto=format"},
                {"Dabur Honey 1kg", "100% pure honey with no added sugar", 399, 549, "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=500&fit=crop&auto=format"},
                {"Haldiram Namkeen 1kg", "Mixed namkeen snack pack, crispy and spicy", 299, 399, "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=500&fit=crop&auto=format"},
                {"Saffola Oats 1kg", "Rolled oats for healthy breakfast, gluten free", 199, 279, "https://images.unsplash.com/photo-1614961233913-a5113a4a34ed?w=500&fit=crop&auto=format"},
                {"Del Monte Ketchup 1kg", "Tomato ketchup with no added preservatives", 189, 249, "https://images.unsplash.com/photo-1606756790138-261d2b21cd75?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, groceryData, grocery, finalSeller);

            // ── MOBILES ────────────────────────────────────────────
            Category mobiles = categoryRepository.findByName("Mobiles").get();
            Object[][] mobilesData = {
                {"iPhone 15 Pro Max", "A17 Pro chip, 48MP camera system, Titanium design, 256GB", 159900, 179900, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&fit=crop&auto=format"},
                {"Samsung Galaxy S24 Ultra", "200MP camera, S Pen, Snapdragon 8 Gen 3, 256GB", 134999, 154999, "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&fit=crop&auto=format"},
                {"OnePlus 12 5G", "Snapdragon 8 Gen 3, 50MP Hasselblad camera, 256GB", 64999, 79999, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&fit=crop&auto=format"},
                {"Xiaomi 14 Pro", "Leica cameras, Snapdragon 8 Gen 3, 4880mAh battery", 99999, 119999, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&fit=crop&auto=format"},
                {"Realme GT 6", "Snapdragon 8s Gen 3, 50MP Sony camera, 5500mAh", 39999, 49999, "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&fit=crop&auto=format"},
                {"Vivo V30 Pro", "50MP Zeiss cameras, 5000mAh, 80W FlashCharge, 256GB", 44999, 54999, "https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=500&fit=crop&auto=format"},
                {"OPPO Reno 11 Pro", "50MP portrait camera, 80W SUPERVOOC, 6.74\" AMOLED", 39999, 49999, "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&fit=crop&auto=format"},
                {"Google Pixel 8 Pro", "Google AI, 50MP camera, 7 years OS updates, 128GB", 89999, 109999, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&fit=crop&auto=format"},
                {"Motorola Edge 50 Pro", "Snapdragon 7 Gen 3, 50MP camera, 125W turbocharging", 31999, 39999, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&fit=crop&auto=format"},
                {"Nothing Phone 2a", "Dimensity 7200 Pro, Glyph Interface, 50MP, 5000mAh", 23999, 29999, "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&fit=crop&auto=format"},
                {"Samsung Galaxy A55", "50MP camera, 5000mAh, IP67 waterproof, 256GB", 34999, 42999, "https://images.unsplash.com/photo-1610945264803-c22b62d2a7b3?w=500&fit=crop&auto=format"},
                {"iPhone 14", "A15 Bionic, 12MP camera, 5G, 128GB, Ceramic Shield", 69900, 84900, "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=500&fit=crop&auto=format"},
                {"Poco X6 Pro 5G", "Dimensity 8300-Ultra, 64MP camera, 5000mAh, 67W", 26999, 34999, "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=500&fit=crop&auto=format"},
                {"Redmi Note 13 Pro Plus", "200MP camera, 5000mAh, 120W HyperCharge, AMOLED", 31999, 39999, "https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=500&fit=crop&auto=format"},
                {"iQOO 12 5G", "Snapdragon 8 Gen 3, 50MP IMX920, 144Hz AMOLED, 5000mAh", 52999, 64999, "https://images.unsplash.com/photo-1574944985070-8f3ebc6b79d2?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, mobilesData, mobiles, finalSeller);

            // ── APPLIANCES ─────────────────────────────────────────
            Category appliances = categoryRepository.findByName("Appliances").get();
            Object[][] appliancesData = {
                {"LG 1.5 Ton Split AC", "5-star inverter AC with Wi-Fi, auto clean, dual inverter", 42990, 59990, "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&fit=crop&auto=format"},
                {"Samsung 8kg Washing Machine", "Fully automatic front load with AI control, steam wash", 44990, 64990, "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&fit=crop&auto=format"},
                {"IFB Microwave Oven 25L", "Convection microwave with 101 auto cook menus", 12990, 18990, "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&fit=crop&auto=format"},
                {"Voltas 310L Refrigerator", "Double door frost-free refrigerator with stabilizer free", 29990, 44990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&fit=crop&auto=format"},
                {"Philips Air Fryer 4.1L", "Digital display, 7 preset programs, rapid air technology", 8990, 14990, "https://images.unsplash.com/photo-1648645913478-a8c3d3e68f11?w=500&fit=crop&auto=format"},
                {"Havells Mixer Grinder", "750W mixer grinder with 3 stainless steel jars", 3490, 5490, "https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=500&fit=crop&auto=format"},
                {"Bajaj Water Heater 15L", "Vertical storage water heater, PUF insulation, BEE 5 star", 8990, 12990, "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&fit=crop&auto=format"},
                {"Dyson V12 Vacuum Cleaner", "Detect Slim cordless vacuum with laser dust detection", 44900, 59900, "https://images.unsplash.com/photo-1558317374-067fb5f30001?w=500&fit=crop&auto=format"},
                {"Kent RO Water Purifier", "Grand Star RO+UV+UF+TDS, 8L storage, mineraliser", 14990, 22990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&fit=crop&auto=format"},
                {"Prestige Induction Cooktop", "2000W induction cooktop with 8 pre-set menus", 3490, 5490, "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&fit=crop&auto=format"},
                {"Usha Tower Fan", "400mm sweep with remote control, 3 speed settings", 5990, 8990, "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&fit=crop&auto=format"},
                {"Panasonic Dishwasher", "Free-standing dishwasher, 12 place settings, 6 programs", 34990, 49990, "https://images.unsplash.com/photo-1604335399105-a0c585fd81a1?w=500&fit=crop&auto=format"},
                {"Orient Electric Iron 2400W", "Steam iron with auto shut-off, non-stick soleplate", 1490, 2490, "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&fit=crop&auto=format"},
                {"Bosch Toaster 4 Slice", "4-slice toaster with 6 browning settings, crumb tray", 4990, 7490, "https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=500&fit=crop&auto=format"},
                {"Whirlpool Chest Freezer 200L", "Deep freezer with fast freeze function, 5-year warranty", 19990, 27990, "https://images.unsplash.com/photo-1571175443880-49e1d25b2bc5?w=500&fit=crop&auto=format"}
            };
            seedProducts(productRepository, appliancesData, appliances, finalSeller);

            System.out.println("✅ 150 sample products seeded successfully!");
        };
    }

    private void seedProducts(ProductRepository productRepository, Object[][] data,
                               Category category, User seller) {
        for (Object[] row : data) {
            Product p = new Product();
            p.setName((String) row[0]);
            p.setDescription((String) row[1]);
            p.setPrice(new BigDecimal(row[2].toString()));
            p.setOriginalPrice(new BigDecimal(row[3].toString()));
            p.setStock(50);
            p.setRating(3.5 + Math.random() * 1.5);
            p.setReviewCount((int)(100 + Math.random() * 5000));
            p.setCategory(category);
            p.setSeller(seller);
            p.setApprovalStatus(ApprovalStatus.APPROVED);
            p.setFeatured(Math.random() > 0.5);
            p.setActive(true);
            p.setImages(List.of((String) row[4]));
            productRepository.save(p);
        }
    }
}