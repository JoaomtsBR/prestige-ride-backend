--
-- PostgreSQL database dump
--

-- Dumped from database version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)
-- Dumped by pg_dump version 12.22 (Ubuntu 12.22-0ubuntu0.20.04.4)

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
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

CREATE SCHEMA public;


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: postgres
--

COMMENT ON SCHEMA public IS 'standard public schema';


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Receipt; Type: TABLE; Schema: public; Owner: angelcar
--

CREATE TABLE public."Receipt" (
    id integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    number text NOT NULL,
    "clientName" text NOT NULL,
    "companyName" text,
    address text NOT NULL,
    "cpfCnpj" text NOT NULL,
    requester text NOT NULL,
    passengers text NOT NULL,
    services jsonb NOT NULL,
    observations text,
    language text NOT NULL,
    "grandTotal" double precision NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "createdById" integer NOT NULL,
    despesa double precision,
    despesas text,
    estacionamento double precision,
    "estacionamentoReal" double precision,
    "impostoPercentual" double precision,
    "impostoValor" double precision,
    "litrosAbastecidos" double precision,
    motorista text,
    "notaFiscal" text,
    pedagio double precision,
    quilometragem double precision,
    "taxaCartao" double precision,
    "updatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "valorCombustivel" double precision
);


ALTER TABLE public."Receipt" OWNER TO angelcar;

--
-- Name: Receipt_id_seq; Type: SEQUENCE; Schema: public; Owner: angelcar
--

CREATE SEQUENCE public."Receipt_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."Receipt_id_seq" OWNER TO angelcar;

--
-- Name: Receipt_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: angelcar
--

ALTER SEQUENCE public."Receipt_id_seq" OWNED BY public."Receipt".id;


--
-- Name: User; Type: TABLE; Schema: public; Owner: angelcar
--

CREATE TABLE public."User" (
    id integer NOT NULL,
    email text NOT NULL,
    name text,
    password text NOT NULL,
    "mustChangePassword" boolean DEFAULT true,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);


ALTER TABLE public."User" OWNER TO angelcar;

--
-- Name: User_id_seq; Type: SEQUENCE; Schema: public; Owner: angelcar
--

CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public."User_id_seq" OWNER TO angelcar;

--
-- Name: User_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: angelcar
--

ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;


--
-- Name: _prisma_migrations; Type: TABLE; Schema: public; Owner: angelcar
--

CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);


ALTER TABLE public._prisma_migrations OWNER TO angelcar;

--
-- Name: Receipt id; Type: DEFAULT; Schema: public; Owner: angelcar
--

ALTER TABLE ONLY public."Receipt" ALTER COLUMN id SET DEFAULT nextval('public."Receipt_id_seq"'::regclass);


--
-- Name: User id; Type: DEFAULT; Schema: public; Owner: angelcar
--

ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);


--
-- Data for Name: Receipt; Type: TABLE DATA; Schema: public; Owner: angelcar
--

COPY public."Receipt" (id, date, number, "clientName", "companyName", address, "cpfCnpj", requester, passengers, services, observations, language, "grandTotal", "createdAt", "createdById", despesa, despesas, estacionamento, "estacionamentoReal", "impostoPercentual", "impostoValor", "litrosAbastecidos", motorista, "notaFiscal", pedagio, quilometragem, "taxaCartao", "updatedAt", "valorCombustivel") FROM stdin;
1	2025-09-22 00:00:00	2025-101	Mariana Vargas	NOV	creditCard		Mariana Vargas	Mariana Vargas	[{"id": "1758552457986", "total": 1400, "extras": 0, "origin": "Campos ", "transfer": 1400, "destination": "GIG", "serviceDate": "2025-09-07T00:00:00.000Z"}, {"id": "1758552526495", "total": 1450, "extras": 50, "origin": "GIG ", "transfer": 1400, "destination": "Campos", "serviceDate": "2025-09-21T00:00:00.000Z"}]	Estacionamento GIG até 1 hora	pt	2850	2025-09-22 14:49:11.763	1	0		0	0	0	\N	0		0	0	0	0	2025-10-08 14:29:20.492	0
2	2025-09-22 00:00:00	2025-102	Lais Miranda	NOV	creditCard		Lais Miranda	Lais Miranda e Victor Mello	[{"id": "1758552987548", "total": 1500, "extras": 50, "origin": "GIG", "transfer": 1450, "destination": "Campos", "serviceDate": "2025-09-21T00:00:00.000Z"}]	Estacionamento GIG até 1 hora	pt	1500	2025-09-22 14:57:40.38	1	0		0	0	0	\N	0		0	0	0	0	2025-10-08 14:25:42.849	0
3	2025-09-22 00:00:00	2025-099	Carolina Correa	NOV	creditCard		Carolina Correa	Carolina Correa	[{"id": "1758554758662", "total": 1000, "extras": 50, "origin": "GIG", "transfer": 950, "destination": "Macae", "serviceDate": "2025-09-23T00:00:00.000Z"}, {"id": "1758554810659", "total": 950, "extras": 0, "origin": "Macae", "transfer": 950, "destination": "GIG", "serviceDate": "2025-09-26T00:00:00.000Z"}]	Estacionamento GIG até 1 hora	pt	1950	2025-09-22 15:27:24.699	1	0		0	0	0	\N	0			0	0	0	2025-10-08 14:25:25.426	0
4	2025-09-17 00:00:00	2025-103	Felipe Freitas		creditCard		Felipe Freitas	Felipe Freitas	[{"id": "1758717975101", "total": 350, "extras": 50, "origin": "GIG", "transfer": 300, "destination": "Copacabana", "serviceDate": "2025-09-08T00:00:00.000Z"}, {"id": "1758718109669", "total": 300, "extras": 0, "origin": "Copacabana", "transfer": 300, "destination": "GIG", "serviceDate": "2025-09-12T00:00:00.000Z"}, {"id": "1758718139686", "total": 300, "extras": 0, "origin": "Ipanema", "transfer": 300, "destination": "GIG", "serviceDate": "2025-09-16T00:00:00.000Z"}]	Parking GIG up to 1 h	en	950	2025-09-24 12:49:40.702	1	0		0	0	0	\N	0		0	0	0	0	2025-10-08 14:26:00.235	0
5	2025-09-29 00:00:00	2025-104	Filio Daskalaki	NOV	creditCard		Filio Daskalaki	Filio Daskalaki	[{"id": "1759159080099", "total": 1600, "extras": 0, "origin": "NOV Rio de Janeiro", "transfer": 1600, "destination": "Ramada Hotel Campos", "serviceDate": "2025-09-23T00:00:00.000Z"}, {"id": "1759159178332", "total": 1800, "extras": 0, "origin": "NOV Porto do Açu", "transfer": 1800, "destination": "Novotel Botafogo Rio de Janeiro", "serviceDate": "2025-09-26T00:00:00.000Z"}]		en	3400	2025-09-29 15:20:15.186	1	0		0	0	0	\N	0		0	0	0	0	2025-10-08 14:26:16.985	0
6	2025-09-27 00:00:00	2025-105	Victor Ferreira	NOV	creditCard		Victor Ferreira	Victor Ferreira / Renato Neves / Diego Cabral	[{"id": "1759176844786", "total": 583.34, "extras": 0, "origin": "Rio de Janeiro", "transfer": 583.34, "destination": "Campos / S J da Barra", "serviceDate": "2025-09-26T00:00:00.000Z"}]		pt	583.34	2025-09-29 20:20:28.171	1	0		0	0	0	\N	0		0	0	0	0	2025-10-08 14:26:31.825	0
7	2025-09-27 00:00:00	2025-106	Renato Neves	NOV	creditCard		Victor Ferreira	Victor Ferreira / Renato Neves / Diego Cabral	[{"id": "1759177231212", "total": 583.34, "extras": 0, "origin": "Rio de Janeiro", "transfer": 583.34, "destination": "Campos / S J da Barra", "serviceDate": "2025-09-26T00:00:00.000Z"}]		pt	583.34	2025-09-29 20:21:17.484	1	0		0	0	0	\N	0		0	0	0	0	2025-10-08 14:26:46.216	0
8	2025-09-27 00:00:00	2025-107	Heittor Inacio	NOV	creditCard		Heittor Inacio	Heittor Inacio	[{"id": "1759177627142", "total": 1450, "extras": 50, "origin": "GIG", "transfer": 1400, "destination": "Campos", "serviceDate": "2025-09-26T00:00:00.000Z"}]	Estacionamento GIG até 1 hora	pt	1450	2025-09-29 20:29:21.717	1	0		0	0	0	\N	0		0	0	0	0	2025-10-08 14:27:48.138	0
10	2025-09-29 00:00:00	2025-109	Diego Cabral	NOV	creditCard		Victor Ferreira	Victor Ferreira / Renato Neves / Diego Cabral	[{"id": "1759436077777", "total": 558.84, "extras": 0, "origin": "Rio de Janeiro", "transfer": 558.84, "destination": "Campos / S J da Barra", "serviceDate": "2025-09-26T00:00:00.000Z"}]		pt	558.84	2025-10-02 20:18:10.424	1	0		0	0	0	\N	0		0	0	0	0	2025-10-08 14:28:07.33	0
9	2025-10-03 00:00:00	2025-108	Marius Fischer	Bekaert	creditCard		Marius Fischer	Marius Fischer / Geert Tempelaere / Maarten De Clercq	[{"id": "1759332281574", "total": 1600, "extras": 0, "origin": "Ipanema In Hotel", "transfer": 1600, "motorista": "Alexandre", "destination": "Ramada Campos Hotel", "serviceDate": "2025-09-30T00:00:00.000Z"}, {"id": "1759332310518", "total": 600, "extras": 0, "origin": "Ramada Campos Hotel", "transfer": 600, "motorista": "Alexandre", "destination": "Porto do Açu - Technip", "serviceDate": "2025-10-01T00:00:00.000Z"}, {"id": "1759332338528", "total": 600, "extras": 0, "origin": "Porto do Açu - Technip", "transfer": 600, "motorista": "Alexandre", "destination": "Ramada Campos Hotel", "serviceDate": "2025-10-01T00:00:00.000Z"}, {"id": "1759332369122", "total": 600, "extras": 0, "origin": "Ramada Campos Hotel", "transfer": 600, "motorista": "Alexandre", "destination": "Porto do Açu - NOV", "serviceDate": "2025-10-02T00:00:00.000Z"}, {"id": "1759332402335", "total": 600, "extras": 0, "origin": "Porto do Açu - NOV", "transfer": 600, "motorista": "Alexandre", "destination": "Ramada Campos Hotel", "serviceDate": "2025-10-02T00:00:00.000Z"}, {"id": "1759332431246", "total": 1600, "extras": 0, "origin": "Ramada Campos Hotel", "transfer": 1600, "motorista": "Alexandre", "destination": "Ritz Hotel Leblon", "serviceDate": "2025-10-03T00:00:00.000Z"}]		en	5600	2025-10-01 15:28:37.281	1	0		0	0	0	\N	81.69			58.7	769	2.85	2025-10-11 15:44:00.958	5.66
32	2025-10-10 00:00:00	2025-110	Danilo Ladeira	NOV	creditCard		Silvana Medeiros	Danilo Ladeira	[{"id": "1760139201485", "total": 1450, "extras": 50, "origin": "GIG", "transfer": 1400, "motorista": "Alexandre", "destination": "Campos", "serviceDate": "2025-10-03T00:00:00.000Z"}]	Estacionamento GIG até 1 hora	pt	1450	2025-10-10 23:34:04.797	1	0		0	33	0	\N	45			58.7	588	2.85	2025-10-11 15:45:21.321	5.66
33	2025-10-12 00:00:00	2025-111	Peter Rusz	NOV	creditCard		Peter Rusz	Peter Rusz	[{"id": "1760197770320", "total": 1400, "extras": 0, "origin": "Pestana Hotel Copacabana", "transfer": 1400, "motorista": "Alexandre", "destination": "Ramada Hotel Campos", "serviceDate": "2025-10-12"}]		en	1400	2025-10-11 15:51:23.791	1	0		0	0	0	\N	50			58.7	588	2.85	2025-10-11 15:51:23.791	5.66
31	2025-10-09 00:00:00	2025-100	TESTE	MOBI	creditCard		Alexandre	João Nascimento	[{"id": "1760049713051", "total": 2500, "extras": 0, "origin": "GIG", "transfer": 2500, "motorista": "Alexandre", "destination": "TIG", "serviceDate": "2025-10-09T00:00:00.000Z"}, {"id": "1760447709254", "total": 550, "extras": 50, "origin": "Macae", "transfer": 500, "motorista": "Alexandre", "destination": "GIG", "serviceDate": "2025-10-14T00:00:00.000Z"}]		pt	3050	2025-10-09 22:43:07.107	2	0		50	33	5	\N	16			4.2	220	4.99	2025-10-14 13:16:00.814	5.66
\.


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: angelcar
--

COPY public."User" (id, email, name, password, "mustChangePassword", "createdAt", "updatedAt") FROM stdin;
1	alexandre@angelcarlocadora.com.br	Alexandre Domingues	$2b$10$1tHHpG5oBtUwlFLpNaIK6u.kTj0uX.SU5zS6c427yYaRIQ6fmuXXG	f	2025-09-19 21:25:38.522	2025-10-02 21:20:44.081
2	admin@angelcarlocadora.com.br	Admin	$2b$10$BjWFk9AQKEsmDdOM.2CJvebbd5AbPZkggfRMLgKhl3QSKtW5IV.B6	f	2025-09-23 14:55:49.522	2025-10-02 21:20:44.087
\.


--
-- Data for Name: _prisma_migrations; Type: TABLE DATA; Schema: public; Owner: angelcar
--

COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
98a3b32a-7c91-4d22-9668-832cb6263509	fd28942a1c9c0bbbe8e28eb0a29a9c0213f745e908afabf122710cccbc97a055	2025-10-02 18:15:38.495709-03	20251002211538_init_user_and_receipt_tables	\N	\N	2025-10-02 18:15:38.444933-03	1
93a19deb-a7e9-43c8-9cfa-6c61fb649757	7c3fff0312a1d3a124fb0d8b9a8c002a8daaa0f0ca3216cf6ad060a21bfafdc8	2025-10-07 15:04:16.525409-03	20251007180416_add_expense_fields_to_receipt	\N	\N	2025-10-07 15:04:16.420854-03	1
\.


--
-- Name: Receipt_id_seq; Type: SEQUENCE SET; Schema: public; Owner: angelcar
--

SELECT pg_catalog.setval('public."Receipt_id_seq"', 33, true);


--
-- Name: User_id_seq; Type: SEQUENCE SET; Schema: public; Owner: angelcar
--

SELECT pg_catalog.setval('public."User_id_seq"', 3, true);


--
-- Name: Receipt Receipt_pkey; Type: CONSTRAINT; Schema: public; Owner: angelcar
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_pkey" PRIMARY KEY (id);


--
-- Name: User User_pkey; Type: CONSTRAINT; Schema: public; Owner: angelcar
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);


--
-- Name: _prisma_migrations _prisma_migrations_pkey; Type: CONSTRAINT; Schema: public; Owner: angelcar
--

ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);


--
-- Name: User_email_key; Type: INDEX; Schema: public; Owner: angelcar
--

CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);


--
-- Name: Receipt Receipt_createdById_fkey; Type: FK CONSTRAINT; Schema: public; Owner: angelcar
--

ALTER TABLE ONLY public."Receipt"
    ADD CONSTRAINT "Receipt_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- PostgreSQL database dump complete
--

