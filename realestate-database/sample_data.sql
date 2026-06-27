--
-- PostgreSQL database dump
--

\restrict xXe9FasUJHi5bRkxhas0MF0pep6TDlg86QyyIs8p7RPnPHhl5wu4QjSgwG0DdTG

-- Dumped from database version 16.11
-- Dumped by pg_dump version 16.11

-- Started on 2026-06-27 12:06:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- TOC entry 4956 (class 0 OID 16494)
-- Dependencies: 216
-- Data for Name: roles; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.roles (id, name) FROM stdin;
2	ROLE_USER
3	ROLE_ADMIN
\.


--
-- TOC entry 4958 (class 0 OID 16500)
-- Dependencies: 218
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (id, email, is_active, name, password, role_id, created_at) FROM stdin;
4	test@gmail.com	t	Test	$2a$10$rk4upuyT9FP0ogJO935J3OtNMRGmtZNA9aky43p5/rEOJxPObF8L.	2	\N
5	test2@gmail.com	t	Test2	$2a$10$qD7XED0kGvNB64uFqs8kdOft1aVaQAjG7YNtHyYVd2t2x.Sv1WskW	2	\N
10	Tyler@gmail.com	t	Tyler Durden	$2a$10$smdl3f65.pVUHvjT1sPZd.reDK.NutKFxg0HEKEHqxwgmYZsCROui	2	\N
11	subash@gmail.com	t	subash	$2a$10$XEejh.304u/6pYe5dMvYwueRybFNE2Sv1lPgUJxgPe1GLPdMX6ymm	2	\N
12	harihari@gmail.com	t	Harish Kumar	$2a$10$85Aj0mGWlLt6Y6PDBUMZe.2ZR7Y3fXtmzfdPLN6/Ism/H338UnFDC	2	\N
13	testagent@demo.com	t	Test Agent	$2a$10$cBI9ixhVEudK798.0qCgbOV.E5aPGDQA2pDbaghI2vQcW6wFPkgUi	2	\N
14	buyer_1772952025534@gmail.com	t	Test Buyer	$2a$10$euUlT2M7vxy/IAPti0h.huADPYrdXy2cy2K.sKEiFy6aLS47zDH7.	2	\N
15	buyer_1772952106655@gmail.com	t	Test Buyer	$2a$10$0rXANYxql/QWOBKGFyNkg.BxXOdGf1H3/ERugkHyXEnUSfHJ/zRs2	2	\N
16	buyer_1772952120332@gmail.com	t	Test Buyer	$2a$10$BlmVymf0BWf1yS4hjgfbtuYQGwbnry1zw9uePYLWNF1CDqtpAxWG6	2	\N
17	buyer_1772952135703@gmail.com	t	Test Buyer	$2a$10$YJQ7LBnI9fDKzBHBCu1LiOEc6sBbiz3t/t4DoKDvPdtBF..hqWgoi	2	\N
18	webbuyer@test.com	t	Web Buyer	$2a$10$mvXY6muGaBLF21xZX.eHYeenE9y5Ofkesj.Gww8RjTMnc4K/8NQJq	2	\N
2	admin@gmail.com	t	Admin	$2a$10$A836gRx.wXE0qbhzZA1G2.R1dVpzrPiKMDbtEu3yHID2h0cW2g5TS	3	\N
19	john@test.com	t	John Doe	$2a$10$jUVWy8jwl0rTxg6saypE3O9ZdqUvB4.Z2NGkL1mhoiRRtX/WjtK/a	2	2026-03-08 13:47:47.60049
\.


--
-- TOC entry 4970 (class 0 OID 16632)
-- Dependencies: 230
-- Data for Name: activity_history; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.activity_history (id, action_type, description, "timestamp", user_id) FROM stdin;
1	PROPERTY_CREATED	Created property: Test API Villa	2026-03-08 12:12:00.527999	2
2	PROPERTY_CREATED	Created property: Test API Villa	2026-03-08 12:12:15.896704	2
3	PROPERTY_CREATED	Created property: Unique Web Property	2026-03-08 12:16:52.091138	2
\.


--
-- TOC entry 4960 (class 0 OID 16517)
-- Dependencies: 220
-- Data for Name: properties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.properties (id, created_at, description, location, price, property_type, title, user_id, contact_number, full_address, status) FROM stdin;
3	2026-02-15 18:33:58.682519	Luxury villa	Chennai	7000000	SALE	Updated Villa A	4	\N	\N	AVAILABLE
4	2026-02-15 18:34:30.641591	villa	Thanjavur	6000000	SALE	Villa 2	5	\N	\N	AVAILABLE
7	2026-03-03 18:47:32.716567	Test Description	Los Angeles	500000	SALE	Test Property	5	+1 (555) 123-4567	123 Main St, Los Angeles, CA 90001	AVAILABLE
6	2026-03-03 12:51:08.804309	A 2BHK flat typically refers to a residential unit that includes two bedrooms, a hall (common area), and a kitchen. This layout is popular among small families or individuals seeking a comfortable living space. Key features of a 2BHK flat include:\nTwo Bedrooms: One bedroom can serve as a master bedroom, while the other can be used for guests or a home office.\nHall (Living Room): This area serves as the main gathering space for family and guests.\nKitchen: Often separate from the living area, it may include modern appliances and storage options.\nThe 2BHK configuration is favored for its balance of space and affordability, making it a common choice in urban real estate markets.	salem	20000000	SALE	luxury house	11	9874637383	674, 5th Main Rd, Ram Nagar South, Madipakkam, Chennai, Tamil Nadu 600091	AVAILABLE
5	2026-02-16 15:13:44.490815	It is a large, detached home often located in serene or scenic settings, symbolizing luxury and exclusivity. Traditionally, villas were upper-class country houses in ancient Rome, designed for leisure and relaxation. Today, they feature spacious rooms, private gardens, pools, and high-end amenities, making them ideal for those seeking upscale living. Villas can vary in size and style, from Mediterranean-style homes to modern tropical estates, and are typically found in suburban or coastal areas, offering privacy and a luxurious lifestyle.	Thanjavur	80000000	RENT	villa	4	\N	\N	SOLD
8	2026-03-08 12:12:00.52178	A beautiful automated test property.	Test City	5000000	SALE	Test API Villa	2	1234567890	123 Test Ave, Testing	AVAILABLE
9	2026-03-08 12:12:15.894336	A beautiful automated test property.	Test City	5000000	SALE	Test API Villa	2	1234567890	123 Test Ave, Testing	SOLD
10	2026-03-08 12:16:52.074124	A beautiful beachfront property in Miami.	Miami	2500000	SALE	Unique Web Property	2	9998887777	456 Beach Ave	SOLD
\.


--
-- TOC entry 4964 (class 0 OID 16544)
-- Dependencies: 224
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, contact_phone, message, request_date, scheduled_time, status, property_id, user_id) FROM stdin;
1	97645429663	👌	2026-02-26 16:11:05.179329	2026-02-28 16:09:00	COMPLETED	4	4
2	7339921313	just for enquiry	2026-03-03 12:55:03.881839	2026-03-04 12:54:00	COMPLETED	3	11
3	7339928380		2026-03-04 14:20:21.720068	2026-03-05 14:20:00	COMPLETED	5	5
4	9876543210	I want to see this property	2026-03-08 12:12:15.957158	2026-03-10 06:42:15.929	PENDING	9	17
5	\N	\N	2026-03-08 12:24:21.48047	2026-03-10 10:00:00	PENDING	10	18
6		Demo visit	2026-06-26 10:53:07.593495	2026-06-28 10:00:00	COMPLETED	10	10
\.


--
-- TOC entry 4962 (class 0 OID 16531)
-- Dependencies: 222
-- Data for Name: property_images; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.property_images (id, image_url, is_primary, upload_date, property_id) FROM stdin;
3	https://images.unsplash.com/photo-1613977257363-707ba9348227?w=600	t	2026-03-03 12:28:06.881013	4
4	https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=600	t	2026-03-03 12:30:10.193118	3
5	https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600	f	2026-03-03 12:30:29.731206	3
7	https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=600	f	2026-03-03 12:31:48.206497	5
6	https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600	t	2026-03-03 12:31:30.788912	5
8	https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=600	t	2026-03-03 12:52:25.338905	6
9	https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=600	t	2026-03-03 18:51:20.004574	7
\.


--
-- TOC entry 4968 (class 0 OID 16596)
-- Dependencies: 228
-- Data for Name: sales; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.sales (id, payment_method, sale_date, sale_price, status, buyer_id, property_id, seller_id) FROM stdin;
1	BANK_TRANSFER	2026-03-04 09:00:00	80000000	COMPLETED	11	5	4
2	CREDIT_CARD	2026-03-08 06:42:16.014	5000000	COMPLETED	17	9	2
3	CASH	2026-03-08 06:55:00	2500000	COMPLETED	18	10	2
\.


--
-- TOC entry 4966 (class 0 OID 16563)
-- Dependencies: 226
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.transactions (id, payment_method, payment_status, price, transaction_date, buyer_id, property_id, seller_id) FROM stdin;
1	CREDIT_CARD	COMPLETED	5000000	2026-03-08 12:12:16.005671	2	9	2
\.


--
-- TOC entry 4976 (class 0 OID 0)
-- Dependencies: 229
-- Name: activity_history_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.activity_history_id_seq', 3, true);


--
-- TOC entry 4977 (class 0 OID 0)
-- Dependencies: 223
-- Name: appointments_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.appointments_id_seq', 6, true);


--
-- TOC entry 4978 (class 0 OID 0)
-- Dependencies: 219
-- Name: properties_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.properties_id_seq', 10, true);


--
-- TOC entry 4979 (class 0 OID 0)
-- Dependencies: 221
-- Name: property_images_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.property_images_id_seq', 9, true);


--
-- TOC entry 4980 (class 0 OID 0)
-- Dependencies: 215
-- Name: roles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.roles_id_seq', 5, true);


--
-- TOC entry 4981 (class 0 OID 0)
-- Dependencies: 227
-- Name: sales_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.sales_id_seq', 3, true);


--
-- TOC entry 4982 (class 0 OID 0)
-- Dependencies: 225
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.transactions_id_seq', 1, true);


--
-- TOC entry 4983 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_id_seq', 19, true);


-- Completed on 2026-06-27 12:06:59

--
-- PostgreSQL database dump complete
--

\unrestrict xXe9FasUJHi5bRkxhas0MF0pep6TDlg86QyyIs8p7RPnPHhl5wu4QjSgwG0DdTG

