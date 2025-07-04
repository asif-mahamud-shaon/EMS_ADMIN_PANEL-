PGDMP                      }            ems_admin_panel    17.5    17.5 C    �           0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                           false            �           0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                           false            �           0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                           false            �           1262    33058    ems_admin_panel    DATABASE     �   CREATE DATABASE ems_admin_panel WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'English_United Kingdom.1252';
    DROP DATABASE ems_admin_panel;
                     postgres    false            `           1247    33078    AttendanceStatus    TYPE     l   CREATE TYPE public."AttendanceStatus" AS ENUM (
    'present',
    'absent',
    'leave',
    'half_day'
);
 %   DROP TYPE public."AttendanceStatus";
       public               postgres    false            c           1247    33088    LeaveStatus    TYPE     \   CREATE TYPE public."LeaveStatus" AS ENUM (
    'pending',
    'approved',
    'rejected'
);
     DROP TYPE public."LeaveStatus";
       public               postgres    false            f           1247    33096 	   LeaveType    TYPE     d   CREATE TYPE public."LeaveType" AS ENUM (
    'annual',
    'sick',
    'emergency',
    'unpaid'
);
    DROP TYPE public."LeaveType";
       public               postgres    false            ]           1247    33073    Role    TYPE     C   CREATE TYPE public."Role" AS ENUM (
    'admin',
    'employee'
);
    DROP TYPE public."Role";
       public               postgres    false            �            1259    33139 
   Attendance    TABLE     �  CREATE TABLE public."Attendance" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    date timestamp(3) without time zone NOT NULL,
    "checkIn" timestamp(3) without time zone,
    "checkOut" timestamp(3) without time zone,
    status public."AttendanceStatus" DEFAULT 'present'::public."AttendanceStatus" NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
     DROP TABLE public."Attendance";
       public         heap r       postgres    false    864    864            �            1259    33138    Attendance_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Attendance_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Attendance_id_seq";
       public               postgres    false    225            �           0    0    Attendance_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Attendance_id_seq" OWNED BY public."Attendance".id;
          public               postgres    false    224            �            1259    33106 
   Department    TABLE       CREATE TABLE public."Department" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "managerId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
     DROP TABLE public."Department";
       public         heap r       postgres    false            �            1259    33105    Department_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Department_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 *   DROP SEQUENCE public."Department_id_seq";
       public               postgres    false    219            �           0    0    Department_id_seq    SEQUENCE OWNED BY     K   ALTER SEQUENCE public."Department_id_seq" OWNED BY public."Department".id;
          public               postgres    false    218            �            1259    33116    Designation    TABLE       CREATE TABLE public."Designation" (
    id integer NOT NULL,
    name text NOT NULL,
    description text,
    "departmentId" integer,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
 !   DROP TABLE public."Designation";
       public         heap r       postgres    false            �            1259    33115    Designation_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Designation_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 +   DROP SEQUENCE public."Designation_id_seq";
       public               postgres    false    221            �           0    0    Designation_id_seq    SEQUENCE OWNED BY     M   ALTER SEQUENCE public."Designation_id_seq" OWNED BY public."Designation".id;
          public               postgres    false    220            �            1259    33148    Leave    TABLE     �  CREATE TABLE public."Leave" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    "leaveType" public."LeaveType" NOT NULL,
    "startDate" timestamp(3) without time zone NOT NULL,
    "endDate" timestamp(3) without time zone NOT NULL,
    reason text,
    status public."LeaveStatus" DEFAULT 'pending'::public."LeaveStatus" NOT NULL,
    "appliedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Leave";
       public         heap r       postgres    false    867    870    867            �            1259    33147    Leave_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Leave_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 %   DROP SEQUENCE public."Leave_id_seq";
       public               postgres    false    227            �           0    0    Leave_id_seq    SEQUENCE OWNED BY     A   ALTER SEQUENCE public."Leave_id_seq" OWNED BY public."Leave".id;
          public               postgres    false    226            �            1259    33159    Payroll    TABLE     D  CREATE TABLE public."Payroll" (
    id integer NOT NULL,
    "userId" integer NOT NULL,
    month integer NOT NULL,
    year integer NOT NULL,
    "basicSalary" numeric(65,30) NOT NULL,
    allowances numeric(65,30) DEFAULT 0 NOT NULL,
    deductions numeric(65,30) DEFAULT 0 NOT NULL,
    bonus numeric(65,30) DEFAULT 0 NOT NULL,
    overtime numeric(65,30) DEFAULT 0 NOT NULL,
    "netSalary" numeric(65,30) NOT NULL,
    notes text,
    "generatedAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL
);
    DROP TABLE public."Payroll";
       public         heap r       postgres    false            �            1259    33158    Payroll_id_seq    SEQUENCE     �   CREATE SEQUENCE public."Payroll_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public."Payroll_id_seq";
       public               postgres    false    229            �           0    0    Payroll_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public."Payroll_id_seq" OWNED BY public."Payroll".id;
          public               postgres    false    228            �            1259    33126    User    TABLE     �  CREATE TABLE public."User" (
    id integer NOT NULL,
    "firstName" text NOT NULL,
    "lastName" text NOT NULL,
    email text NOT NULL,
    "passwordHash" text NOT NULL,
    role public."Role" DEFAULT 'employee'::public."Role" NOT NULL,
    "departmentId" integer,
    "designationId" integer,
    "dateJoined" timestamp(3) without time zone,
    "isActive" boolean DEFAULT true NOT NULL,
    "basicSalary" numeric(65,30) DEFAULT 0 NOT NULL,
    "createdAt" timestamp(3) without time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" timestamp(3) without time zone NOT NULL,
    address text,
    avatar text,
    "bloodGroup" text,
    "dateOfBirth" timestamp(3) without time zone,
    "emergencyContact" text,
    "nationalId" text,
    phone text
);
    DROP TABLE public."User";
       public         heap r       postgres    false    861    861            �            1259    33125    User_id_seq    SEQUENCE     �   CREATE SEQUENCE public."User_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public."User_id_seq";
       public               postgres    false    223            �           0    0    User_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public."User_id_seq" OWNED BY public."User".id;
          public               postgres    false    222            �            1259    33061    _prisma_migrations    TABLE     �  CREATE TABLE public._prisma_migrations (
    id character varying(36) NOT NULL,
    checksum character varying(64) NOT NULL,
    finished_at timestamp with time zone,
    migration_name character varying(255) NOT NULL,
    logs text,
    rolled_back_at timestamp with time zone,
    started_at timestamp with time zone DEFAULT now() NOT NULL,
    applied_steps_count integer DEFAULT 0 NOT NULL
);
 &   DROP TABLE public._prisma_migrations;
       public         heap r       postgres    false            �           2604    33142    Attendance id    DEFAULT     r   ALTER TABLE ONLY public."Attendance" ALTER COLUMN id SET DEFAULT nextval('public."Attendance_id_seq"'::regclass);
 >   ALTER TABLE public."Attendance" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    224    225    225            �           2604    33109    Department id    DEFAULT     r   ALTER TABLE ONLY public."Department" ALTER COLUMN id SET DEFAULT nextval('public."Department_id_seq"'::regclass);
 >   ALTER TABLE public."Department" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    219    218    219            �           2604    33119    Designation id    DEFAULT     t   ALTER TABLE ONLY public."Designation" ALTER COLUMN id SET DEFAULT nextval('public."Designation_id_seq"'::regclass);
 ?   ALTER TABLE public."Designation" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    221    220    221            �           2604    33151    Leave id    DEFAULT     h   ALTER TABLE ONLY public."Leave" ALTER COLUMN id SET DEFAULT nextval('public."Leave_id_seq"'::regclass);
 9   ALTER TABLE public."Leave" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    226    227    227            �           2604    33162 
   Payroll id    DEFAULT     l   ALTER TABLE ONLY public."Payroll" ALTER COLUMN id SET DEFAULT nextval('public."Payroll_id_seq"'::regclass);
 ;   ALTER TABLE public."Payroll" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    229    228    229            �           2604    33129    User id    DEFAULT     f   ALTER TABLE ONLY public."User" ALTER COLUMN id SET DEFAULT nextval('public."User_id_seq"'::regclass);
 8   ALTER TABLE public."User" ALTER COLUMN id DROP DEFAULT;
       public               postgres    false    222    223    223            {          0    33139 
   Attendance 
   TABLE DATA           s   COPY public."Attendance" (id, "userId", date, "checkIn", "checkOut", status, "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    225   4X       u          0    33106 
   Department 
   TABLE DATA           d   COPY public."Department" (id, name, description, "managerId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    219   �o       w          0    33116    Designation 
   TABLE DATA           h   COPY public."Designation" (id, name, description, "departmentId", "createdAt", "updatedAt") FROM stdin;
    public               postgres    false    221   q       }          0    33148    Leave 
   TABLE DATA           ~   COPY public."Leave" (id, "userId", "leaveType", "startDate", "endDate", reason, status, "appliedAt", "updatedAt") FROM stdin;
    public               postgres    false    227   0s                 0    33159    Payroll 
   TABLE DATA           �   COPY public."Payroll" (id, "userId", month, year, "basicSalary", allowances, deductions, bonus, overtime, "netSalary", notes, "generatedAt", "updatedAt") FROM stdin;
    public               postgres    false    229   rw       y          0    33126    User 
   TABLE DATA             COPY public."User" (id, "firstName", "lastName", email, "passwordHash", role, "departmentId", "designationId", "dateJoined", "isActive", "basicSalary", "createdAt", "updatedAt", address, avatar, "bloodGroup", "dateOfBirth", "emergencyContact", "nationalId", phone) FROM stdin;
    public               postgres    false    223   �{       s          0    33061    _prisma_migrations 
   TABLE DATA           �   COPY public._prisma_migrations (id, checksum, finished_at, migration_name, logs, rolled_back_at, started_at, applied_steps_count) FROM stdin;
    public               postgres    false    217   ��       �           0    0    Attendance_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Attendance_id_seq"', 589, true);
          public               postgres    false    224            �           0    0    Department_id_seq    SEQUENCE SET     B   SELECT pg_catalog.setval('public."Department_id_seq"', 25, true);
          public               postgres    false    218            �           0    0    Designation_id_seq    SEQUENCE SET     C   SELECT pg_catalog.setval('public."Designation_id_seq"', 25, true);
          public               postgres    false    220            �           0    0    Leave_id_seq    SEQUENCE SET     =   SELECT pg_catalog.setval('public."Leave_id_seq"', 64, true);
          public               postgres    false    226            �           0    0    Payroll_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public."Payroll_id_seq"', 96, true);
          public               postgres    false    228            �           0    0    User_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public."User_id_seq"', 57, true);
          public               postgres    false    222            �           2606    33146    Attendance Attendance_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."Attendance" DROP CONSTRAINT "Attendance_pkey";
       public                 postgres    false    225            �           2606    33114    Department Department_pkey 
   CONSTRAINT     \   ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_pkey" PRIMARY KEY (id);
 H   ALTER TABLE ONLY public."Department" DROP CONSTRAINT "Department_pkey";
       public                 postgres    false    219            �           2606    33124    Designation Designation_pkey 
   CONSTRAINT     ^   ALTER TABLE ONLY public."Designation"
    ADD CONSTRAINT "Designation_pkey" PRIMARY KEY (id);
 J   ALTER TABLE ONLY public."Designation" DROP CONSTRAINT "Designation_pkey";
       public                 postgres    false    221            �           2606    33157    Leave Leave_pkey 
   CONSTRAINT     R   ALTER TABLE ONLY public."Leave"
    ADD CONSTRAINT "Leave_pkey" PRIMARY KEY (id);
 >   ALTER TABLE ONLY public."Leave" DROP CONSTRAINT "Leave_pkey";
       public                 postgres    false    227            �           2606    33171    Payroll Payroll_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public."Payroll"
    ADD CONSTRAINT "Payroll_pkey" PRIMARY KEY (id);
 B   ALTER TABLE ONLY public."Payroll" DROP CONSTRAINT "Payroll_pkey";
       public                 postgres    false    229            �           2606    33137    User User_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_pkey" PRIMARY KEY (id);
 <   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_pkey";
       public                 postgres    false    223            �           2606    33069 *   _prisma_migrations _prisma_migrations_pkey 
   CONSTRAINT     h   ALTER TABLE ONLY public._prisma_migrations
    ADD CONSTRAINT _prisma_migrations_pkey PRIMARY KEY (id);
 T   ALTER TABLE ONLY public._prisma_migrations DROP CONSTRAINT _prisma_migrations_pkey;
       public                 postgres    false    217            �           1259    33175    Attendance_userId_date_key    INDEX     f   CREATE UNIQUE INDEX "Attendance_userId_date_key" ON public."Attendance" USING btree ("userId", date);
 0   DROP INDEX public."Attendance_userId_date_key";
       public                 postgres    false    225    225            �           1259    33173    Department_managerId_key    INDEX     a   CREATE UNIQUE INDEX "Department_managerId_key" ON public."Department" USING btree ("managerId");
 .   DROP INDEX public."Department_managerId_key";
       public                 postgres    false    219            �           1259    33172    Department_name_key    INDEX     U   CREATE UNIQUE INDEX "Department_name_key" ON public."Department" USING btree (name);
 )   DROP INDEX public."Department_name_key";
       public                 postgres    false    219            �           1259    33638 !   Designation_name_departmentId_key    INDEX     t   CREATE UNIQUE INDEX "Designation_name_departmentId_key" ON public."Designation" USING btree (name, "departmentId");
 7   DROP INDEX public."Designation_name_departmentId_key";
       public                 postgres    false    221    221            �           1259    33176    Payroll_userId_month_year_key    INDEX     m   CREATE UNIQUE INDEX "Payroll_userId_month_year_key" ON public."Payroll" USING btree ("userId", month, year);
 3   DROP INDEX public."Payroll_userId_month_year_key";
       public                 postgres    false    229    229    229            �           1259    33174    User_email_key    INDEX     K   CREATE UNIQUE INDEX "User_email_key" ON public."User" USING btree (email);
 $   DROP INDEX public."User_email_key";
       public                 postgres    false    223            �           1259    33639    User_nationalId_key    INDEX     W   CREATE UNIQUE INDEX "User_nationalId_key" ON public."User" USING btree ("nationalId");
 )   DROP INDEX public."User_nationalId_key";
       public                 postgres    false    223            �           2606    33197 !   Attendance Attendance_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Attendance"
    ADD CONSTRAINT "Attendance_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 O   ALTER TABLE ONLY public."Attendance" DROP CONSTRAINT "Attendance_userId_fkey";
       public               postgres    false    4818    225    223            �           2606    33177 $   Department Department_managerId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Department"
    ADD CONSTRAINT "Department_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 R   ALTER TABLE ONLY public."Department" DROP CONSTRAINT "Department_managerId_fkey";
       public               postgres    false    219    223    4818            �           2606    33182 )   Designation Designation_departmentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Designation"
    ADD CONSTRAINT "Designation_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 W   ALTER TABLE ONLY public."Designation" DROP CONSTRAINT "Designation_departmentId_fkey";
       public               postgres    false    4811    221    219            �           2606    33202    Leave Leave_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Leave"
    ADD CONSTRAINT "Leave_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 E   ALTER TABLE ONLY public."Leave" DROP CONSTRAINT "Leave_userId_fkey";
       public               postgres    false    227    223    4818            �           2606    33207    Payroll Payroll_userId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."Payroll"
    ADD CONSTRAINT "Payroll_userId_fkey" FOREIGN KEY ("userId") REFERENCES public."User"(id) ON UPDATE CASCADE ON DELETE RESTRICT;
 I   ALTER TABLE ONLY public."Payroll" DROP CONSTRAINT "Payroll_userId_fkey";
       public               postgres    false    223    229    4818            �           2606    33187    User User_departmentId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES public."Department"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 I   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_departmentId_fkey";
       public               postgres    false    219    4811    223            �           2606    33192    User User_designationId_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "User_designationId_fkey" FOREIGN KEY ("designationId") REFERENCES public."Designation"(id) ON UPDATE CASCADE ON DELETE SET NULL;
 J   ALTER TABLE ONLY public."User" DROP CONSTRAINT "User_designationId_fkey";
       public               postgres    false    221    223    4814            {      x���O�%����)�����>���:���{�"�O�=1+j��J�$��L_�+�X���Ϙ������5V���g)?K��b��!��������w�]��?O���B0Ī\�[�Ѹ�+{A�Ad�{���] �\?L
@���)�< ��=���]�_�#@����� ����R��a�����^�� �����R���'������`{�EW��%��$ A���0`#���%��}H?��\�{ �Zu5u��"� FE��h�;��	�r������wGdj 
@"�r�y
lk��.���+ �܅��� �qw4�	 ��������M��Ң� A�p�&�^�4���* �y�&8��&�^_w�?�7(����umL�.~��T�����#����1�������?��.������a��Ol|?��O�|�դ��������~��_�����_��w0v��}o�������!0}q����K�/�� 8���-;Ы���	�N\�_���� X�@���a< �F��VP���^��mp��	�
Ʌ��A|+�`�
� ����(���]�\�kIQ%�� h�P\\B��t	\��E����B8>������@��bb�@ڂs��� �f�m7�b�k�#(_�r;�ȧWl�
���ź��
�=8W�h
P���c��*� �Ŷ�H��6�� �H2�K���o�k|O �$ϣDQH�Y�� �gѸ�:�٥� �]�$6�k ť������6� V�2���=�N�h���å�^ ��= :�ѵ�$�xE��^QE�� �� @Į�����Y�T!�XC�"�IPl��s��Є�s����UQ�.�	�eF阤w��w�� 	���hr\�\��*���� �7K���-[��n�� �5�Ǫ@�<k���GѸ�3J���-}���6� �8UG׷l�@����@��p�|��,�
Η�*8�A �E���
��� ��]����"�5��_�PI�*����B�tn�6�gR���� X����,��H{��Q��n\�>�|>T��H ,R��\�E(2Xp\�O/���|�GDqK{="�ni��L۠su_ФI� F��B�P=W�@��M@��j��Ȑ���f�PF�:rݹ2�"P	�����Il�|w��0����E��DH����r�.��-HA[���2W��.) ��a���F���������ۚ-� ��(��'o�At�3�/��)YJ`>%% TAI�|�b R͗d�.��3 ��",�팖� 袒���p:�`�G��cy�{J��@��ڒ݆A>a�E0>att� ,�g� ��$8��X,'A�S_��d���͑�N��J�K�k~�A�����uȨ�������� +��3�����=�E592� � -�)�`��;���-(����.����S��Dq;�KM����%��Ӣ��t�`& �p�EA(��a����V7��烠喼��M��]=+�_�O�z��5��2|`��{@��:�EA�o���`V�α!�,��G��	�/� �H8�ɔp2-{t!z���mH�p�?�O�e~�cib\�D�2���%ǂ V!�*�%\�x.�Lu��"�RSF�.�ȭ$P�-Oc�%�~��a�N�
Bx�Oo�?5 d�tW5��蕸U8�V
��2=��]8?�^�-��E�?o��T �+8C)�%�#���`�?��C�uh�mF��$_ߑ�A=uB3 ��H.��f�v�@_脁����莮�������g�y1̱4�J�4(��sl����N��~[��I��s�\U���Y -��E`z��x��G��b�2�۠�M���Y��D�l�9	l���~�q���^`?IB4��P�X��d.�D���� ��D�L!�-s!l�py?F6vX
��������\�!.j�A��5�ȡ2���b&�Hc%��I�8[��-2��a��LC�y,B�_�i��_6��ZldH[ԏ��/����	@�$h�4@��$���a2Nt�l�U�A�y�=�<HWo9�Bϳ`����F���I��ԇ��vW�46���|>Ie���AY�xd\��	�WM�242�q-]�BP"Z�AD+���8�5�G�͘���!�`ƒ� �����	m"�5�	��<�13�'���6����@Y�S�E J�����T�@q�O��-BY�U��<��@�8"{�.z.����4���N�yH�� +h�l�{�%��A���<�>B{K�^��7�_�;*�줛i��y7��J|�lx��.&%O{�Z�{���uy��9�19��Z֓ q�(9Y�^ϋ	�8�̍���2Hf��@�!���Fr'���w�n��4�ʭ��:2�0�'Ӑ��qvy��qv���f?���>�E�)<�>f�>N���G(Y��B0JA��ٓe(Kq;FPBJ��^���q!�f,Ky�f7��wh���r��#��r���0���d��0_}lZ�^.�٦ͻ�%��=PW;	x^&����V<�	�2���!�΢��ivPX�=Y��3s�>�Y��A�z��'A�9H�8W�f���q� ����I�T�����&n6R/�z� �p"dn6�Q�ho�W���7��u���HAz������ͣ�E]J��q��F��,�f�!ن��c%�7k�lZ	��A��o�A��Q���%��q��m�j6�S*0O����0�l��a���h�� �����
�S��"������7瑸��"���q�q���l#a _"�HH0d�rayy����x�qt"�'L �A�U��������o�D>�s�I��<�����F����>��HZ#����y��� F;(H�dɳX�EP�G_��)� ����	�JNtd`�v`���v���u�UX�"$��$0z(��|,���I�g�܈��2(:�#q�-�� /�xi�!t����8�R0_@�yɣ=,�"D����V|�A��D��^��1�J)��_C ���W�R z�H ��y�et���B06ʼ�ٰі7	�W���k%0��r����󃮵-��&X�q�D06�m {�%B��!^i�峞�>h�	�$��N<1�6���F� �?,9� �b u=B]�@�N�*�*�^�ظ�qy��J>��=�D}�?S"���$��j�s����X{���Ƿ�t#�oO�@  h����F 35Q6��N�9NW���g���g�Z*�9nL%3iU�8\�K1���K�����V>�]�W3�;�I�z�X	b?u�*�s��F���cSmǘISI�8���Jq"ؔ"M��aH�wd�A��ء�s|�&�aо�0�i��G�?�:����:�1�@�{]�i��Y�BL�Ę���m���ju���uyHps�d���$	#�W��_�A{����I�H�������<���OF�/�Aw�z�L��NJ���J<�<�g�&99WB�Y�~�L��41Т&���}۰�$���d|z�d/A�2�O�SƧGO�����<�A �B�K	�@n��@)�ڒL�9�%�y�.˻k~yɂ �R��Č��j~Y�z��R"/.�
jh5��?-@)RJ���罠5�}!�PJ'B�O�ڢ���d7"R��s��	�RJ��0R���Qc�=	�����Bjqi��	d{�I`k/�	�c^z�c%�?+��*h��D��q�	������}����w��~^�-�����" ��j���Ds��� É���c)�\����J�a�x�d�D����0����1���h��  v�����77ɑ	�~���(�`yǱ$@`I���o�,/��@&+NK��  f��YH��Xx(� d  Ws.�  J�$X���D�hM���aJ���f�i��ަ� �2Lii���*j�Bh�\��N(��$0�нh����N�l��0��.��6ZQ:������Ro��q0y� L�A�)/��z��l)�؆c���(�.�|��̖P�  ���+C�<��	�F`�Р=C>�:�����0�*�d��J'A�!n(���ޫ`�<�e 2��ꟴ��ߋ`�9n ��X��n�-�"�-hP1��ǫ�
�vqH
dK���#�1"j�e������M�!N�v��;�{8����f ���:8�ើ�F��/��B���>z���/N6�	H/��_�0�X��q�e8	"���O��I`=��go��k�j�o[`)�Z���Ё����H-ֶh��y��	,A�A ���I���lq���I���	���MX[�� �a$��+HpoL�&�4&���x,����'A0����GV̑����<	̗xР"wRG�����:�&���~"(�U�2�G�Y+:P˝T�Q�R����	,�@-wRIǱ(E,��<;��8�A^[&����t�N�R��b�Ӏ�#i��>`�U	�Ghֆ��@?#+%.���c)�} ��S� ;�[��e�ɍL���̜���;3���5t�x2M�p�s��h��/r�V�����>���u���œml��,� ��_# ��=�P����bu�� p� e�X��e�ne$����#��@�Z�e�������W���bߘ.�1�zx9���g��9�-��V=��䗴e��`O����JW�4�RX�l�q-��Ư����=j�!.-�7�W>5W��
u��ɥ�ޚ6�U��kSG�Ӷ`'��L��;��<� ��+�[��{*�V0W��t��G5���H_SL�?�m�`&�B�k��@^3�fr�p�.�UA.C0Dq��*@%���_.R��,�Ox�%W�IiTӞ|�4��p,�<�כ���Khި��WZG�[GYz[V�F�~S�櫂��і4ʞ�ߊ{`�-�?}��{&Ԋ��y��[����t��6�'����>4���B������J}��Ev�y�V]H�VqwKy��-}�9m���|��t��w��	��ty�5�[*��]�m��j�G�u@ْbv44�� �)�m!�!=F��Q���k^S�vz�9ʒ{R(��>q�+  G1W��pK
%w����c[�D�|kA)}>�$�B�衉�ռ~lw�E&���}�T�/�AmI��MbdMK���kB�5��I~S
�=	饵S��WrV��ի�w��m���_ݠ�
5e(.����r�~U7����
|�-]��0���a�
x�0Ϳ�4���}�����?����1�܇�V���f�=�A4� !�}��*�B|)�3�Ql��Y͍���qU�58	��2z�ߊ���IHvG)����A�g�Ѓ�}���A����M
=���9�5U,���YAԼ�;,[���V���N0F�a!Av%-w��]���],���6UR���R%m�m0E�Nd�K�#��YɺQx����� _=�=��QvK��%���I`��P�1ݡK��N�}!d��a�O����V(����� ����
B_6#NS>�t��v0��Hҳt�P�g�t�NC��@7��MO�����,�F@տgbR_�"D�W���r,U�#-�C[ӗ��u|�V��ȩ�Hw��%#�A�ﯶ���GN�BZ"�4�l���PښA�BMF�T�qM�2I!/	�P
�����	�.y1�B�5)�l�X4F I֔��?~8��o�[8      u   b  x���MS�0��ɯ��S�@���9zPg��^b�Ҍ��$ԩ��P�EGf��7��<�%Awzc�b^M��o���٣���wf�԰iZ�ψ�;��Z	-����a�&���I⺶5֣��1���bN3�U���<*�叼����(�KL�m��&O�Lg98t�Zi� $Ĭ�A����á��0->:�`�<eQ���i�St#4��9��tڻc$B�V2��nz����KW7�G���|�Nq��}��k௘�pa���5�/�;��:��i�/������豅a�]1!�a4'48G��9:�>�����x�.��Y��	���7`�ފvD��g,1sZ�E�L(^G�O���      w     x����n1��g��/��?,������&�D�En\3!n�^�^Z޾�	-��*��:��=sf<HX���CWneQ��O AUu1�/T)dsY֗e5˂�Q����A�o��X��'g�^����=��X�7m|���
�`���6b��Xgc
:�^V��X�����N���(�d��8��~���R��W���9��ٴ!�Ģ%c�:�C+�Z�c�:�Vb�}XZwȇc1Y�!�����㔸����01�w.i��L�E�R�X�و���]�#����ټX��V���5�E���J���k�Sڇ~g��B���]ٔk�K<��A��˜~��x:��iA�[0��A��+Jd�d/ܴ����.��LVU�j��#���c�:�!|�r�i'&1v��ȟ��]q:�]8�b�ʛ��֞>#f-UL��:vm�Csjż8����fVF-1o�#�1�Y���N���J�������Q�+��m_�_1�VGU�Ի�_��@��O���������X���      }   2  x���Mn1���)r#�?���1�A�6u�)��W32��<VtQ6�|z|R�B5�O������n��������?{?8\�n]�2��~��w�q���N��������C{�/�!��?����;=p�n����󷈀R�2E+B����8,�a�~���:#��)��^�/�2
�h��8�^ϛ	|&X�"
mH���a�:�qx�#˥SN�CT����m��,d��9�������Vg�,u��o�d��!�2t�!ph@4&R��*P���Q�9m�R4R�DL�,��G�:h�)JyjϷC��QWF�êx�Z���ҋ^]$��e���?-����H!�"���>��h���2AP��R�]��>]-�AG��b��P0
:����@�	�*�5��i�A���	{B?tK�7��	��=���n���.��	�ByW�g$��U�t��s�ӂHu��s���j�a���Q[�R��ɣ\4|Q7["�� �2���5>��!����F������uf+Q�ę�w"��K�ā���.�ڲӆR������$rm��p-�ގ�����'�l�R��"TV�]��X�T*�@Tn�&&$���d�V:���0���^N�^��:'��T㔡�k2�!��^)��F����SF�1r�uaX�&p/�,L�,* 1�>�o&�8��S��\��:d�*7���0�z3d�lV�> L�A�q6��R�C��)�e�`��hc d14�E��v#Hu�&c��6�F#*V�	���9�w0D����G޳�|e��h$�v��_���(��N���,<���r�"e��؄��@�kk��l��4�9e�d������:� ���wuj��$
��v,j�=\ȉj��gЀc���k�W��?�m��qH�T��|S'�"�oL�����ׂ4�����V(�t�ϡ-��i��8=0���M!��B�A.MD��'ji[*C�a�X~��>!�` ���
?�As�h����=����GC�!da?��. }k��ay־bSu�&�z ����         m  x��ώ$5���S��(��2W�<�^���iX�=�!AH���֪m��(�V�r��N�O�B5�k8j��5���[{8כ{R�7A�DYR.�C�������_^~���_~��ӧ����?��!�K:�����x��>�by�㵖D9�E�#�:@� 0R�q�Qˢc��ܺ�-S	�3M�������l������ 8�a +$�V�E���S�dL�X`�F-�z�M�a(Smq�H�V�U��� ��A�"��e�Z���֐�"UP�=�ɏ-���GjlPk�ñk9gd�ͷmH�>�4jYԣ�#�jp�t���1R���(Pͣ�Јeiյ���uИ_|�'�!g8�� ��2���`V�1(IôS)MJ3wX+>~4hYġ�#��߹1Mfii�
p����Ǐ-K������&�y��f� �V�lK���~��-{_F�ƉR�_k�jH�5��c��D�a��F-�z��-r����
MJ ��0�� ~4hY�?7���Bi���hE�"��Y (�(K� �;��X��QGn	����|�zI�n�`��F��I�o ��8ٺ�ڭ���O�t���\���*hj���7Jc�Yك<�K,sq��2��x�i��r���A��%���bj����)���R�W�R;��q&���s���s���c�2�r	Ǯ�+%-_9K�,��2���\*\�8��i:�L�J����ԩ�D*FB��1y�&z�ʜ+�(��q��:���d�	��]$'����ޤv���*W�|����\�-�
Kj�|�5DEZgΕ*����v��1K�F%�V�N�+�"_�H�4c���JMh��WjB.N�&�v��1M�,
��<�K����T���s+=ɘ���ÓMyD�Ty�M.Ƙ���Wڈ�'�x�v�e*�/<+m�G��l�Y�����<������`_x�U��F�ܘf;x��zR���Siv�c�y,�x�����I�5�m`����N����:qug��C�;w����i>F�,|�h<�5P����$c��1����<����6yK��3��P���x/�YRMd�u�<��j:����\��9�7~(9�rR>���z">D�Yd��
9Ř9{���D��|b      y   �  x���IS�L�ϭ_��[>�hq���`&�\�HF�Z����iY��"U�+Q*���\Տ��yKF<BA�{��«��}/x�$�
۔o���ޘ�iG�Ǆ�r��M�Z��A4�g��竇�;������)y�Zd6��"J��:@5j���RsKg����L
0K�4�}�'��n���jƮ�j��$N/�o�9�_p�����1?�S�0-�a��:p��戚b�!/�)~�V1�c�%
��M)9�)�J6�Q��l0�jM"]0Z��Ӏ�1�p��9�MN�U�+ty�8RZWX�.��`��l�Ӱ��T�!��`��)��8�A�� �1䫘p�{�d�.�(�@H�
ɱއ�lܓ0z�i"�D�k��̱טDM�`����2�JȴJ��dJ�7��0�sr�(x�7��=L��l��%CӺ� m��1�xԼ�IYŽH�.�!"��8ْ}s�P�E�m�����V�M�L�i]S���L ��J�1���������dˆ	�7�ڐ-H��L�`d	H��`0�����^�$��Y�3i��p�3#�0��\��ou�����FB�DMq���'0.��H��uދ-p����Y9V.LPJZ��"��	P� ��)x<���<)3a
�?O�b)��;(�b-��q�ä��̑���Q��)���i0/�2	��~L�D�*@f�C�~���}�p����ڌ���
@�B-��yT���u&�F�\�6�vft$����a/��tv�x`�����|r���FeJ���i1'-�o��]�$8ޕm�<��v*9�CS��q�RG@�V�후7��4��ݺ�N?غ���i��{�����w����s�З�v����ӟދ}����p`���"<y�ln�?��2�+y�?�1�۩d�\8���"�2S@�N��J8q�m�8��<{�4�v�,�X�4-	��
v�%9�\N�^������m\�k���y���4�9���*#A����jH�ke8;,as���s-8�Q8���#�7n�EJ�MSo���Y?]��r�OV(�%�+XZWX��28��E��bk�rO�h�z��	����q�nr<�aR�_�,�7��C̳�;��?oFYz�O$���l��]���pr�L��dQh�36ө|��m�iT�i^����S��\��yN`�]S'�ɪ�����R~EQ� �bթ      s   �   x�m�;
�0��:E���ڿ|����]ܤ����:�t�c�B2��Q+�>��&�֎�$�O�zh�B@��Pm��)��17��ܬQB�Tۇe\[L(�"ߐf�Y���N~���睉	�����տ�Ł/���(�|Lv-     