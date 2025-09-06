import requests
import json
import asyncio
import websockets
import sys
import select

BASE_URL = "http://127.0.0.1:8000"
access_token = None
idea_id = None

def print_response(response):
    print(f"Status Code: {response.status_code}")
    try:
        print(f"Response JSON: {response.json()}")
        return response.json()
    except requests.exceptions.JSONDecodeError:
        print(f"Response Text: {response.text}")
        return None

def signup():
    email = input("Enter email: ")
    password = input("Enter password: ")
    name = input("Enter name: ")
    print("\nSending signup request...")
    response = requests.post(f"{BASE_URL}/auth/signup", json={"email": email, "password": password, "name": name})
    print_response(response)
    print("Signup request finished.")

def verify_otp():
    email = input("Enter email: ")
    otp = input("Enter OTP: ")
    print("\nSending OTP verification request...")
    response = requests.post(f"{BASE_URL}/auth/verify-otp", json={"email": email, "token": otp})
    print_response(response)
    print("OTP verification request finished.")

def login():
    global access_token
    email = input("Enter email: ")
    password = input("Enter password: ")
    print("\nSending login request...")
    response = requests.post(f"{BASE_URL}/auth/token", data={"username": email, "password": password})
    json_response = print_response(response)
    if json_response and "access_token" in json_response:
        access_token = json_response["access_token"]
        print("\nLogin successful. Access token stored.")
    print("Login request finished.")

def forgot_password():
    email = input("Enter email: ")
    print("\nSending forgot password request...")
    response = requests.post(f"{BASE_URL}/auth/forgot-password", json={"email": email})
    print_response(response)
    print("Forgot password request finished.")

def update_password():
    global access_token
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    new_password = input("Enter new password: ")
    headers = {"Authorization": f"Bearer {access_token}"}
    print("\nSending update password request...")
    response = requests.post(f"{BASE_URL}/auth/update-password", json={"password": new_password}, headers=headers)
    print_response(response)
    print("Update password request finished.")

def get_user_me():
    global access_token
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    headers = {"Authorization": f"Bearer {access_token}"}
    print("\nSending get user info request...")
    response = requests.get(f"{BASE_URL}/users/me", headers=headers)
    print_response(response)
    print("Get user info request finished.")

def create_profile():
    global access_token
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    headers = {"Authorization": f"Bearer {access_token}"}
    user_data = {"name": "Test User", "location": "Test Location", "about": "I am a test user."}
    skills = {"python": "expert", "fastapi": "intermediate"}
    print("\nSending create profile request...")
    response = requests.post(f"{BASE_URL}/user/profile", headers=headers, json={"user_data": user_data, "skills": skills})
    print_response(response)
    print("Create profile request finished.")

def get_profile():
    global access_token
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    headers = {"Authorization": f"Bearer {access_token}"}
    print("\nSending get profile request...")
    response = requests.get(f"{BASE_URL}/user/profile", headers=headers)
    print_response(response)
    print("Get profile request finished.")

def update_profile():
    global access_token
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    headers = {"Authorization": f"Bearer {access_token}"}
    user_data = {"name": "Test User Updated", "location": "Test Location Updated", "about": "I am a test user, updated."}
    skills = {"python": "expert", "fastapi": "expert"}
    print("\nSending update profile request...")
    response = requests.put(f"{BASE_URL}/user/profile", headers=headers, json={"user_data": user_data, "skills": skills})
    print_response(response)
    print("Update profile request finished.")

def create_idea_cli():
    global access_token, idea_id
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    headers = {"Authorization": f"Bearer {access_token}"}
    title = input("Enter idea title: ")
    sub_title = input("Enter idea sub title: ")
    full_explained_idea = input("Enter the full explained idea: ")
    print("\nSending create idea request...")
    response = requests.post(
        f"{BASE_URL}/ideas/",
        headers=headers,
        data={
            "title": title,
            "sub_title": sub_title,
            "full_explained_idea": full_explained_idea,
        },
    )
    json_response = print_response(response)
    if json_response and "id" in json_response:
        idea_id = json_response["id"]
        print(f"\nIdea created with ID: {idea_id}")
    print("Create idea request finished.")

def create_idea_with_image_cli():
    global access_token, idea_id
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    headers = {"Authorization": f"Bearer {access_token}"}
    title = input("Enter idea title: ")
    sub_title = input("Enter idea sub title: ")
    full_explained_idea = input("Enter the full explained idea: ")
    image_path = input("Enter the path to the image file: ").strip()

    try:
        with open(image_path, "rb") as f:
            # 1. Get signed URL
            response = requests.post(
                f"{BASE_URL}/ideas/create_upload_url?file_name={image_path}",
                headers=headers,
            )
            signed_url_response = print_response(response)
            if not signed_url_response or "signed_url" not in signed_url_response:
                print("Could not get signed URL")
                return

            signed_url = signed_url_response["signed_url"]["signedUrl"]

            # 2. Upload file to Supabase Storage
            with open(image_path, 'rb') as f:
                response = requests.put(signed_url, data=f)
                if response.status_code != 200:
                    print("Failed to upload file to Supabase Storage")
                    print_response(response)
                    return

            image_url = signed_url.split("?")[0]

            # 3. Create idea in database
            data = {
                "title": title,
                "sub_title": sub_title,
                "full_explained_idea": full_explained_idea,
                "image_url": image_url,
            }
            response = requests.post(
                f"{BASE_URL}/ideas/",
                headers=headers,
                data=data,
            )
            json_response = print_response(response)
            if json_response and "id" in json_response:
                idea_id = json_response["id"]
                print(f"\nIdea created with ID: {idea_id}")
            print("Create idea with image request finished.")

    except FileNotFoundError:
        print(f"Error: The file was not found at the specified path: {image_path}")

def send_message_cli():
    global access_token, idea_id
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    if not idea_id:
        print("\nPlease create an idea first to get an idea ID.")
        return
    headers = {"Authorization": f"Bearer {access_token}"}
    content = input("Enter message content: ")
    print("\nSending message...")
    response = requests.post(
        f"{BASE_URL}/ideas/{idea_id}/messages",
        headers=headers,
        json={"content": content},
    )
    print_response(response)
    print("Send message request finished.")

async def get_messages_cli():
    global access_token, idea_id
    if not access_token:
        print("\nPlease log in first to get an access token.")
        return
    if not idea_id:
        print("\nPlease create an idea first to get an idea ID.")
        return

    uri = f"ws://127.0.0.1:8000/ws/ideas/{idea_id}/messages?token={access_token}"
    try:
        async with websockets.connect(uri) as websocket:
            print("Connected to message stream. Press Enter to exit.")
            while True:
                try:
                    message = await asyncio.wait_for(websocket.recv(), timeout=0.1)
                    print(f"New message: {message}")
                except asyncio.TimeoutError:
                    pass
                except websockets.exceptions.ConnectionClosed:
                    print("Connection closed.")
                    break

                # Check for user input to exit
                if select.select([sys.stdin], [], [], 0) == ([sys.stdin], [], []):
                    break

    except Exception as e:
        print(f"Error connecting to websocket: {e}")

def main():
    while True:
        print("\nSelect an option:")
        print("1. Sign up")
        print("2. Verify OTP")
        print("3. Login")
        print("4. Forgot Password")
        print("5. Update Password")
        print("6. Get User Info")
        print("7. Create Profile")
        print("8. Get Profile")
        print("9. Update Profile")
        print("10. Create Idea")
        print("11. Create Idea with Image")
        print("12. Send Message")
        print("13. Get Messages (Real-time)")
        print("14. Exit")

        choice = input("Enter your choice: ")

        if choice == '1':
            signup()
        elif choice == '2':
            verify_otp()
        elif choice == '3':
            login()
        elif choice == '4':
            forgot_password()
        elif choice == '5':
            update_password()
        elif choice == '6':
            get_user_me()
        elif choice == '7':
            create_profile()
        elif choice == '8':
            get_profile()
        elif choice == '9':
            update_profile()
        elif choice == '10':
            create_idea_cli()
        elif choice == '11':
            create_idea_with_image_cli()
        elif choice == '12':
            send_message_cli()
        elif choice == '13':
            asyncio.run(get_messages_cli())
        elif choice == '14':
            break
        else:
            print("Invalid choice. Please try again.")


if __name__ == "__main__":
    main()